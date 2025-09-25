from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session, select

from ..auth import get_current_user, get_session
from ..models import Paper, User
from ..services import research, gemini
from ..tools.paper_search import search_papers as unified_search
from ..settings import settings
from ..utils.pdf import extract_text_from_pdf


router = APIRouter()


@router.get("/search-papers")
async def search_papers(query: str, source: Optional[str] = None, limit: int = 10):
    # Use unified search (Semantic Scholar first, fallback arXiv) and ignore source param for simplicity
    results = await unified_search(query, limit)
    return {"results": results}


@router.post("/upload-paper")
async def upload_and_analyze_paper(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    text = extract_text_from_pdf(await file.read())  # type: ignore[arg-type]
    summary = gemini.summarize_paper(text)
    paper = Paper(owner_id=user.id, title=title or file.filename, source="upload", extracted_text=text)
    session.add(paper)
    session.commit()
    session.refresh(paper)
    # naive XP grant
    user.xp += 25
    session.add(user)
    session.commit()
    return {"paper_id": paper.id, "summary": summary, "xp": user.xp}


class ComparePayload:
    a_abstract: str
    b_abstract: str


@router.post("/compare-papers")
def compare_papers(a_abstract: str = Form(...), b_abstract: str = Form(...)):
    comparison = gemini.compare_abstracts(a_abstract, b_abstract)
    return {"comparison": comparison}


@router.post("/find-research-gaps")
def find_research_gaps(topic: str = Form(...), abstracts: List[str] = Form(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    result = gemini.find_gaps(topic, abstracts)
    user.xp += 15
    session.add(user)
    session.commit()
    return {"gaps": result, "xp": user.xp}

