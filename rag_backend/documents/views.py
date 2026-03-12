from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Document
from .serializers import DocumentUploadSerializer, DocumentListSerializer
from .utils import process_document


class UploadDocumentView(APIView):
    def post(self, request):
        serializer = DocumentUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uploaded = serializer.validated_data["file"]
        name = uploaded.name
        file_type = name.split(".")[-1].lower()

        doc = Document.objects.create(
            name=name,
            file=uploaded,
            file_type=file_type,
            metadata={"size": uploaded.size},
        )

        try:
            chunk_count = process_document(doc)
        except Exception as exc:
            doc.delete()
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {
                "id": doc.id,
                "name": doc.name,
                "file_type": doc.file_type,
                "chunks": chunk_count,
            },
            status=status.HTTP_201_CREATED,
        )


class DocumentListView(APIView):
    def get(self, request):
        docs = Document.objects.order_by("-created_at")
        data = DocumentListSerializer(docs, many=True).data
        return Response(data)
