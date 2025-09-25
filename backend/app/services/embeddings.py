from typing import List
import numpy as np

try:
    from google import genai
except Exception:
    genai = None  # type: ignore

from ..settings import settings


EMBED_MODEL = "text-embedding-004"


def _client():
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not configured")
    if genai is None:
        raise RuntimeError("google-genai not installed")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def embed_texts(texts: List[str]) -> np.ndarray:
    client = _client()
    vectors: List[np.ndarray] = []
    for t in texts:
        # Single-call embedding for reliability
        resp = client.models.embed_content(model=EMBED_MODEL, content=t)
        vec = np.array(resp.embedding.values, dtype=np.float32)
        vectors.append(vec)
    return np.vstack(vectors)

