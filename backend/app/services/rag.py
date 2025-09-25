from typing import List, Dict, Any
import os
import json
import numpy as np
import faiss

from .embeddings import embed_texts
from .gemini import analyze_text


INDEX_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "rag_index.faiss")
META_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "rag_meta.jsonl")


def _load_index(d: int) -> faiss.IndexFlatIP:
    if os.path.exists(INDEX_PATH):
        return faiss.read_index(INDEX_PATH)  # type: ignore
    index = faiss.IndexFlatIP(d)
    return index


def _save_index(index: faiss.IndexFlatIP) -> None:
    faiss.write_index(index, INDEX_PATH)


def _append_meta(meta: Dict[str, Any]) -> None:
    with open(META_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(meta, ensure_ascii=False) + "\n")


def chunk_text(text: str, max_chars: int = 1200, overlap: int = 100) -> List[str]:
    chunks: List[str] = []
    start = 0
    n = len(text)
    while start < n:
        end = min(n, start + max_chars)
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
        if start < 0:
            start = 0
        if start >= n:
            break
    return chunks


def ingest_document(doc_id: str, text: str, source: str) -> int:
    chunks = chunk_text(text)
    if not chunks:
        return 0
    vectors = embed_texts(chunks)
    # normalize for Inner Product sim = cosine
    faiss.normalize_L2(vectors)
    index = _load_index(vectors.shape[1])
    index.add(vectors)
    _save_index(index)
    for i, chunk in enumerate(chunks):
        _append_meta({"doc_id": doc_id, "i": i, "source": source, "text": chunk})
    return len(chunks)


def _load_meta() -> List[Dict[str, Any]]:
    if not os.path.exists(META_PATH):
        return []
    rows = []
    with open(META_PATH, "r", encoding="utf-8") as f:
        for line in f:
            try:
                rows.append(json.loads(line))
            except Exception:
                pass
    return rows


def query(question: str, k: int = 8, doc_id: str | None = None) -> Dict[str, Any]:
    metas = _load_meta()
    if not metas:
        return {"answer": "No documents ingested yet.", "contexts": []}
    # build index dimension from first embedding by re-embedding one short string
    q_vec = embed_texts([question])
    faiss.normalize_L2(q_vec)
    index = _load_index(q_vec.shape[1])
    if index.ntotal == 0:
        return {"answer": "No documents in index yet.", "contexts": []}
    D, I = index.search(q_vec, k)
    contexts = []
    for idx in I[0]:
        if idx >= 0 and idx < len(metas):
            contexts.append(metas[idx])
    if doc_id:
        only = [c for c in contexts if str(c.get("doc_id")) == str(doc_id)]
        if only:
            contexts = only
    context_text = "\n\n".join([c["text"] for c in contexts])
    prompt = (
        "You are a grounded research assistant. Using ONLY the provided context, answer the question."
        " Cite relevant doc_id and chunk i. If insufficient, say what is missing.\n\n"
        f"Question: {question}\n\nContext:\n{context_text}"
    )
    answer = analyze_text(prompt)
    return {"answer": answer, "contexts": contexts}

