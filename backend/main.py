from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import shutil
import os
import fitz
from sentence_transformers import SentenceTransformer
import numpy as np
from groq import Groq

app = FastAPI(title="DocRetrieve AI Backend")

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

model = SentenceTransformer('all-MiniLM-L6-v2')
vector_store = []

# === CHANGE THIS WITH YOUR KEY ===
# GROQ_API_KEY = "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"   # ← Paste your Groq key here
# groq_client = Groq(api_key=GROQ_API_KEY)

import os
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set!")
groq_client = Groq(api_key=GROQ_API_KEY)

@app.get("/")
def read_root():
    return {"message": "Full RAG with Groq is ready! 🚀"}

@app.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    global vector_store
    results = []
    
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extracted_text = ""
        if file.filename.lower().endswith('.pdf'):
            doc = fitz.open(file_path)
            for page in doc:
                extracted_text += page.get_text()
            doc.close()

        # Better chunking
        lines = [line.strip() for line in extracted_text.split('\n') if line.strip()]
        chunks = []
        current = ""
        for line in lines:
            current += line + "\n"
            if len(current) > 180:
                chunks.append(current.strip())
                current = ""
        if current:
            chunks.append(current.strip())

        if chunks:
            embeddings = model.encode(chunks)
            for i, chunk in enumerate(chunks):
                vector_store.append({
                    "filename": file.filename,
                    "chunk": chunk,
                    "embedding": embeddings[i].tolist()
                })

        results.append({"filename": file.filename, "chunks": len(chunks)})

    return {"message": "Uploaded", "files": results}

@app.get("/search")
async def search_documents(query: str):
    if not vector_store:
        return {"answer": "No documents uploaded yet.", "sources": []}

    # Retrieve relevant chunks
    query_embedding = model.encode([query])[0]
    similarities = []
    for item in vector_store:
        emb = np.array(item["embedding"])
        sim = np.dot(query_embedding, emb) / (np.linalg.norm(query_embedding) * np.linalg.norm(emb) + 1e-8)
        similarities.append((sim, item))

    top_results = sorted(similarities, key=lambda x: x[0], reverse=True)[:4]
    context = "\n\n".join([item['chunk'] for _, item in top_results])

    # === Call Groq LLM for clean answer ===
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions based only on the provided documents. Be precise and concise."},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}\nAnswer naturally and mention sources if possible."}
            ],
            temperature=0.3,
            max_tokens=500
        )
        answer = completion.choices[0].message.content
    except Exception as e:
        answer = f"LLM error: {str(e)}"

    return {
        "answer": answer,
        "sources": list(set([item['filename'] for _, item in top_results]))
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)