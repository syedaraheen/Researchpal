from typing import Any, Dict, List, Literal, Optional, Tuple
from .services import research, gemini
from .tools.paper_search import search_papers as unified_search


ToolName = Literal[
    "search_papers",
    "summarize_text",
    "compare_papers",
    "find_research_gaps",
    "generate_timeline",
    "simulate_debate",
]


async def search_papers(query: str, limit: int = 10) -> Dict[str, Any]:
    results = await unified_search(query, limit)
    return {"results": results}


def summarize_text(text: str) -> str:
    return gemini.summarize_paper(text)


def compare_papers(a_abstract: str, b_abstract: str) -> str:
    return gemini.compare_abstracts(a_abstract, b_abstract)


def find_research_gaps(topic: str, abstracts: List[str]) -> str:
    return gemini.find_gaps(topic, abstracts)


async def generate_timeline(topic: str) -> Dict[str, Any]:
    # fetch arXiv newest and try to infer evolution via years
    ax = await research.search_arxiv(topic, max_results=20)
    # best-effort: already newest-first feed; create a brief model summary
    summary = gemini.analyze_text(
        f"Create a short timeline of research evolution for topic '{topic}' given these paper titles and abstracts."
        f" Return key eras with 2-3 bullets each.\n\n{[p.get('title') for p in ax]}"
    )
    # shape minimal timeline points (client can render)
    items = [
        {"id": i, "title": p.get("title"), "abstract": p.get("abstract", ""), "source": "arxiv"}
        for i, p in enumerate(ax)
    ]
    return {"summary": summary, "items": items}


def simulate_debate(a: str, b: str, a_cite: Optional[str] = None, b_cite: Optional[str] = None) -> str:
    cite_a = f" (cite: {a_cite})" if a_cite else ""
    cite_b = f" (cite: {b_cite})" if b_cite else ""
    prompt = (
        "Simulate an academic debate between two papers/authors.\n"
        "Return a structured transcript with turns labeled 'Paper A' and 'Paper B'. Include brief citations inline.\n\n"
        f"Paper A{cite_a}:\n{a}\n\nPaper B{cite_b}:\n{b}\n"
    )
    return gemini.analyze_text(prompt)


async def decide_and_run(intent: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    low = intent.lower()
    if any(k in low for k in ["compare", "difference"]):
        out = compare_papers(payload.get("a", ""), payload.get("b", ""))
        return {"tool": "compare_papers", "result": out}
    if any(k in low for k in ["gap", "underexplored"]):
        out = find_research_gaps(payload.get("topic", ""), payload.get("abstracts", []))
        return {"tool": "find_research_gaps", "result": out}
    if any(k in low for k in ["timeline", "evolve", "evolution", "history"]):
        out = await generate_timeline(payload.get("topic", ""))
        return {"tool": "generate_timeline", "result": out}
    if "debate" in low:
        out = simulate_debate(payload.get("a", ""), payload.get("b", ""), payload.get("a_cite"), payload.get("b_cite"))
        return {"tool": "simulate_debate", "result": out}
    if any(k in low for k in ["search", "find papers", "papers"]):
        out = await search_papers(payload.get("query", ""))
        return {"tool": "search_papers", "result": out}
    # default summarize
    text = payload.get("text") or payload.get("a") or payload.get("b") or ""
    out = summarize_text(text)
    return {"tool": "summarize_text", "result": out}

