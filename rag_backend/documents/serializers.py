from rest_framework import serializers
from .models import Document


class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "name", "file", "file_type", "metadata", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_file(self, value):
        name = value.name.lower()
        if not (name.endswith(".pdf") or name.endswith(".txt") or name.endswith(".docx")):
            raise serializers.ValidationError("Only PDF, TXT, and DOCX files are supported.")
        return value


class DocumentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "name", "file_type", "metadata", "created_at"]
