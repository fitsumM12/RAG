# RAG Application

Production-ready Retrieval Augmented Generation stack with Django + React (Vite) and a persistent vector database.

## Project Structure

Backend:
- rag_backend/
  - manage.py
  - rag_backend/
  - documents/
  - chat/

Frontend:
- rag-frontend/
  - src/
    - components/
    - pages/
    - services/

## Setup

### Backend

1. Create and activate a Python 3.11+ virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables:

- rag_backend/.env

4. Run migrations and start the server:

```bash
cd rag_backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend

1. Install dependencies:

```bash
cd rag-frontend
npm install
```

2. Start the dev server:

```bash
npm run dev
```

## Environment Variables

Backend: `rag_backend/.env`
- DJANGO_SECRET_KEY
- DJANGO_DEBUG
- DJANGO_ALLOWED_HOSTS
- CORS_ALLOWED_ORIGINS
- RAG_VECTOR_DB (chroma or faiss)
- CHROMA_PERSIST_DIR
- FAISS_INDEX_DIR
- EMBEDDING_MODEL_NAME
- LLM_PROVIDER (openai or local)
- OPENAI_API_KEY
- OPENAI_MODEL
- LOCAL_LLM_URL (for Ollama-style local LLM)
- LOCAL_LLM_MODEL
- RAG_TOP_K
- MEMORY_MAX_TURNS

Frontend: `rag-frontend/.env`
- VITE_API_BASE_URL

## Example API Calls

Upload document:
```bash
curl -X POST http://localhost:8000/api/upload/ \
  -F "file=@/path/to/document.pdf"
```

Ask question:
```bash
curl -X POST http://localhost:8000/api/ask/ \
  -H "Content-Type: application/json" \
  -d '{"question": "What is machine learning?"}'
```

Stream question:
```bash
curl -X POST http://localhost:8000/api/ask/stream/ \
  -H "Content-Type: application/json" \
  -d '{"question": "Summarize the key points"}'
```

## Notes
- Uploading documents triggers chunking, embedding, and storage in the vector database.
- Responses include source snippets with highlighted terms.
- Conversation memory uses the last N turns for continuity.
