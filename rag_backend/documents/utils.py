import uuid
from typing import List
from langchain_core.documents import Document as LCDocument
from .models import Document


def _load_documents(file_path: str, file_type: str) -> List[LCDocument]:
    from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
    if file_type == "pdf":
        loader = PyPDFLoader(file_path)
    elif file_type == "txt":
        loader = TextLoader(file_path, encoding="utf-8")
    else:
        loader = Docx2txtLoader(file_path)
    return loader.load()


def process_document(doc: Document) -> int:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from rag.vector_store import add_documents
    file_type = doc.file_type
    raw_docs = _load_documents(doc.file.path, file_type)

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(raw_docs)

    enhanced: List[LCDocument] = []
    for chunk in chunks:
        chunk_id = str(uuid.uuid4())
        metadata = chunk.metadata or {}
        metadata.update(
            {
                "document_id": doc.id,
                "document_name": doc.name,
                "file_type": doc.file_type,
                "chunk_id": chunk_id,
            }
        )
        enhanced.append(LCDocument(page_content=chunk.page_content, metadata=metadata))

    add_documents(enhanced)
    return len(enhanced)
