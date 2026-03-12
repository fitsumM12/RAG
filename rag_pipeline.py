import os
from langchain.text_splitter.recursive import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
from transformers import pipeline

# Load documents from folder
folder_path = "docs/"
documents = []
for filename in os.listdir(folder_path):
    if filename.endswith(".txt"):
        with open(os.path.join(folder_path, filename), "r", encoding="utf-8") as f:
            documents.append(f.read())
print(f"Loaded {len(documents)} documents")

# Split text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs_chunks = text_splitter.split_text("\n".join(documents))
print(f"Created {len(docs_chunks)} chunks")

# Create embeddings
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# FAISS vector store
vectorstore = FAISS.from_texts(docs_chunks, embedding_model)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Load LLM
generator = pipeline("text-generation", model="gpt2")
llm = HuggingFacePipeline(pipeline=generator)

# Create Retrieval QA chain
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# Ask question
question = "What is FAISS?"
answer = qa_chain.run(question)
print("Answer:", answer)
