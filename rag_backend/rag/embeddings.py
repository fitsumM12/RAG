from django.conf import settings
from langchain_community.embeddings import HuggingFaceEmbeddings

_EMBEDDINGS = None


def get_embeddings() -> HuggingFaceEmbeddings:
    global _EMBEDDINGS
    if _EMBEDDINGS is None:
        _EMBEDDINGS = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL_NAME)
    return _EMBEDDINGS
