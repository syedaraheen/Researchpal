from typing import Any, List
from ..settings import settings

try:
    from google import genai
except Exception:  # pragma: no cover
    genai = None  # type: ignore


MODEL_NAME = "gemini-2.5-flash"


def _client():
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not configured")
    if genai is None:
        raise RuntimeError("google-genai not installed")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def analyze_text(prompt: str) -> str:
    client = _client()
    response = client.models.generate_content(model=MODEL_NAME, contents=prompt)
    return getattr(response, "text", "")


def compare_abstracts(a: str, b: str) -> str:
    prompt = (
        "You are a meticulous research assistant. Compare the two abstracts.\n"
        "Return sections: Key Contributions, Similarities, Differences, Strengths, Weaknesses.\n\n"
        f"Abstract A:\n{a}\n\nAbstract B:\n{b}\n"
    )
    return analyze_text(prompt)


def summarize_paper(full_text: str) -> str:
    prompt = (
        "Summarize this research paper into the following sections: Title (if present), Contributions, Methods, Results, Strengths, Weaknesses, Research Gaps.\n"
        "Return PLAIN TEXT only (no Markdown). Do NOT use asterisks or bold. Use simple lines or hyphens if you need bullets.\n\n"
        f"Paper Content:\n{full_text[:30000]}"
    )
    return analyze_text(prompt)


def find_gaps(topic: str, abstracts: List[str]) -> str:
    joined = "\n\n".join(abstracts[:20])
    prompt = (
        f"Topic: {topic}\n"
        "Given these abstracts, identify: Well-studied areas (Green), Underexplored/Missing (Red).\n"
        "Return strict JSON with fields: gaps: [{label, importance: 1-10, field, rationale}], covered: [{label, field}]."
        f"\n\nAbstracts:\n{joined}"
    )
    return analyze_text(prompt)

