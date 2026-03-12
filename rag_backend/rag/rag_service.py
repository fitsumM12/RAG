import re
from typing import List, Tuple
from django.conf import settings
from langchain_core.documents import Document
from .vector_store import similarity_search_with_score


def _normalize_terms(text: str) -> List[str]:
    words = re.findall(r"[A-Za-z0-9_]+", text)
    seen = []
    for w in words:
        lw = w.lower()
        if lw not in seen and len(lw) > 2:
            seen.append(lw)
    return seen[:12]


def highlight_text(text: str, question: str) -> str:
    terms = _normalize_terms(question)
    if not terms:
        return text
    pattern = re.compile(r"\b(" + "|".join(map(re.escape, terms)) + r")\b", re.IGNORECASE)
    return pattern.sub(r"**\\1**", text)


def build_prompt(question: str, context: str, memory: List[Tuple[str, str]]) -> str:
    memory_block = ""
    if memory:
        lines = []
        for role, content in memory:
            lines.append(f"{role.title()}: {content}")
        memory_block = "\n\nPrevious conversation:\n" + "\n".join(lines)

    return (
        "You are a helpful assistant. Use the provided context to answer the question. "
        "If the answer is not in the context, say you don't know.\n\n"
        f"Context:\n{context}"
        f"{memory_block}\n\n"
        f"Question:\n{question}\n\n"
        "Answer:"
    )


def retrieve_context(question: str, top_k: int) -> List[Tuple[Document, float]]:
    return similarity_search_with_score(question, k=top_k)


def format_sources(results: List[Tuple[Document, float]], question: str):
    sources = []
    for doc, score in results:
        metadata = doc.metadata or {}
        snippet = doc.page_content[:800]
        sources.append(
            {
                "text": snippet,
                "highlighted_text": highlight_text(snippet, question),
                "metadata": metadata,
                "score": score,
            }
        )
    return sources
