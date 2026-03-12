import json
from typing import List, Tuple
from django.conf import settings
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ChatSession, ChatMessage
from .serializers import AskSerializer
from rag.rag_service import build_prompt, format_sources, retrieve_context
from rag.llm import generate_answer, stream_answer


def _get_session(conversation_id):
    if conversation_id:
        try:
            return ChatSession.objects.get(id=conversation_id)
        except ChatSession.DoesNotExist:
            pass
    return ChatSession.objects.create()


def _get_memory(session: ChatSession) -> List[Tuple[str, str]]:
    max_turns = settings.MEMORY_MAX_TURNS
    messages = list(session.messages.order_by("-created_at")[: max_turns * 2])
    messages.reverse()
    return [(m.role, m.content) for m in messages]


def _build_context(results):
    blocks = []
    for doc, _score in results:
        meta = doc.metadata or {}
        source = meta.get("document_name") or meta.get("source") or "document"
        page = meta.get("page")
        header = f"Source: {source}"
        if page is not None:
            header += f" (page {page})"
        blocks.append(f"{header}\n{doc.page_content}")
    return "\n\n---\n\n".join(blocks)


class AskView(APIView):
    def post(self, request):
        serializer = AskSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        question = serializer.validated_data["question"]
        top_k = serializer.validated_data.get("top_k", settings.RAG_TOP_K)
        conversation_id = serializer.validated_data.get("conversation_id")

        session = _get_session(conversation_id)
        memory = _get_memory(session)

        results = retrieve_context(question, top_k)
        context = _build_context(results)
        prompt = build_prompt(question, context, memory)
        answer = generate_answer(prompt)
        sources = format_sources(results, question)

        ChatMessage.objects.create(session=session, role="user", content=question)
        ChatMessage.objects.create(session=session, role="assistant", content=answer, sources=sources)

        return Response(
            {
                "answer": answer,
                "sources": sources,
                "conversation_id": session.id,
            }
        )


class AskStreamView(APIView):
    def post(self, request):
        serializer = AskSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        question = serializer.validated_data["question"]
        top_k = serializer.validated_data.get("top_k", settings.RAG_TOP_K)
        conversation_id = serializer.validated_data.get("conversation_id")

        session = _get_session(conversation_id)
        memory = _get_memory(session)

        results = retrieve_context(question, top_k)
        context = _build_context(results)
        prompt = build_prompt(question, context, memory)
        sources = format_sources(results, question)

        def event_stream():
            collected = []
            for token in stream_answer(prompt):
                collected.append(token)
                yield f"data: {json.dumps({'token': token})}\n\n"
            final_answer = "".join(collected)
            ChatMessage.objects.create(session=session, role="user", content=question)
            ChatMessage.objects.create(session=session, role="assistant", content=final_answer, sources=sources)
            payload = {
                "done": True,
                "answer": final_answer,
                "sources": sources,
                "conversation_id": session.id,
            }
            yield f"data: {json.dumps(payload)}\n\n"

        response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
        response["Cache-Control"] = "no-cache"
        return response
