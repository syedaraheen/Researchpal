from typing import Any, Dict, List, Optional
import httpx


SEMANTIC_SCHOLAR_BASE = "https://api.semanticscholar.org/graph/v1"
ARXIV_BASE = "http://export.arxiv.org/api/query"


async def search_semantic_scholar(query: str, limit: int = 10, api_key: Optional[str] = None) -> List[Dict[str, Any]]:
    fields = "title,abstract,authors,year,citationCount,externalIds"
    headers = {"x-api-key": api_key} if api_key else {}
    url = f"{SEMANTIC_SCHOLAR_BASE}/paper/search?query={query}&limit={limit}&fields={fields}"
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(url, headers=headers)
        r.raise_for_status()
        data = r.json()
        return data.get("data", [])


async def search_arxiv(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    # Basic arXiv Atom feed search
    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": max_results,
    }
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(ARXIV_BASE, params=params)
        r.raise_for_status()
        text = r.text
        # Minimal parse to extract entries titles/ids (avoid heavy deps)
        results: List[Dict[str, Any]] = []
        for chunk in text.split("<entry>")[1:]:
            title = chunk.split("<title>")[1].split("</title>")[0].strip()
            id_tag = chunk.split("<id>")[1].split("</id>")[0].strip()
            summary = chunk.split("<summary>")[1].split("</summary>")[0].strip() if "<summary>" in chunk else ""
            results.append({"title": title, "id": id_tag, "abstract": summary, "source": "arxiv"})
        return results


async def paper_with_citations(paper_id: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    fields = "title,abstract,year,authors,citations.paperId,citations.title,references.paperId,references.title"
    headers = {"x-api-key": api_key} if api_key else {}
    url = f"{SEMANTIC_SCHOLAR_BASE}/paper/{paper_id}?fields={fields}"
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(url, headers=headers)
        r.raise_for_status()
        return r.json()

