import os
from typing import List, Tuple
from django.conf import settings
from langchain_community.vectorstores import Chroma, FAISS
from langchain_core.documents import Document
from .embeddings import get_embeddings

_VECTOR_STORE = None


def _load_faiss(embeddings):
    index_dir = settings.FAISS_INDEX_DIR
    if os.path.isdir(index_dir) and os.listdir(index_dir):
        return FAISS.load_local(index_dir, embeddings, allow_dangerous_deserialization=True)
    return FAISS.from_documents([], embeddings)


def get_vector_store():
    global _VECTOR_STORE
    if _VECTOR_STORE is not None:
        return _VECTOR_STORE

    embeddings = get_embeddings()
    if settings.RAG_VECTOR_DB.lower() == "faiss":
        _VECTOR_STORE = _load_faiss(embeddings)
    else:
        _VECTOR_STORE = Chroma(
            collection_name="rag_documents",
            persist_directory=settings.CHROMA_PERSIST_DIR,
            embedding_function=embeddings,
        )
    return _VECTOR_STORE


def add_documents(documents: List[Document]) -> None:
    store = get_vector_store()
    store.add_documents(documents)
    if settings.RAG_VECTOR_DB.lower() == "faiss":
        store.save_local(settings.FAISS_INDEX_DIR)
    else:
        store.persist()


def similarity_search_with_score(query: str, k: int) -> List[Tuple[Document, float]]:
    store = get_vector_store()
    return store.similarity_search_with_score(query, k=k)
