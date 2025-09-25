from typing import Any, Dict, List, Optional
import httpx
import feedparser
from ..settings import settings


SEMANTIC_SCHOLAR_BASE = "https://api.semanticscholar.org/graph/v1"
ARXIV_BASE = "http://export.arxiv.org/api/query"


def _normalize_ss_item(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "title": item.get("title") or "",
        "abstract": item.get("abstract") or "",
        "authors": [a.get("name") for a in (item.get("authors") or []) if a.get("name")],
        "year": item.get("year"),
        "citationCount": item.get("citationCount"),
        "link": f"https://www.semanticscholar.org/paper/{item.get('paperId')}" if item.get("paperId") else "",
    }


def _normalize_arxiv_entry(entry: Any) -> Dict[str, Any]:
    authors = [a.get("name") for a in (entry.get("authors") or []) if a.get("name")]
    # feedparser: entry.link, entry.published, entry.summary
    year = None
    if entry.get("published"):
        try:
            year = int(entry.get("published")[:4])
        except Exception:
            year = None
    return {
        "title": entry.get("title", ""),
        "abstract": entry.get("summary", "") or "",
        "authors": authors,
        "year": year,
        "citationCount": None,
        "link": entry.get("link", ""),
    }


async def search_semantic_scholar(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    fields = "title,abstract,authors,year,citationCount"
    headers = {"x-api-key": settings.SEMANTIC_SCHOLAR_API_KEY} if settings.SEMANTIC_SCHOLAR_API_KEY else {}
    url = f"{SEMANTIC_SCHOLAR_BASE}/paper/search?query={query}&limit={limit}&fields={fields}"
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(url, headers=headers)
        if r.status_code >= 400:
            raise httpx.HTTPError(f"Semantic Scholar error {r.status_code}")
        data = r.json()
        items = data.get("data", [])
    return [_normalize_ss_item(it) for it in items]


async def search_arxiv(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": limit,
    }
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(ARXIV_BASE, params=params)
        r.raise_for_status()
        feed = feedparser.parse(r.text)
    return [_normalize_arxiv_entry(e) for e in (feed.entries or [])]


async def search_papers(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    try:
        return await search_semantic_scholar(query, limit)
    except Exception:
        return await search_arxiv(query, limit)

