from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from ..auth import get_current_user, get_session
from ..models import User, Paper
from sqlmodel import Session
from ..utils.pdf import extract_text_from_pdf
from ..services import rag, gemini


router = APIRouter()


class AnalyzePayload(BaseModel):
    question: str
    doc_id: str | None = None


@router.post("/ingest-paper")
async def ingest_paper(file: UploadFile = File(...), source: str = Form("upload"), user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    text = extract_text_from_pdf(await file.read())
    paper = Paper(owner_id=user.id, title=file.filename, source=source, extracted_text=text)
    session.add(paper)
    session.commit()
    session.refresh(paper)
    chunks = rag.ingest_document(str(paper.id), text, source)
    return {"paper_id": paper.id, "chunks": chunks}


@router.post("/analyze-rag")
def analyze_rag(body: AnalyzePayload, session: Session = Depends(get_session)):
    try:
        # Direct approach: use paper text with Gemini for reliable answers
        if body.doc_id:
            paper = session.get(Paper, int(body.doc_id))
            if paper and paper.extracted_text:
                prompt = (
                    "You are a research assistant. Answer the user's question using ONLY the provided paper text.\n"
                    "Be specific and cite relevant parts. If the answer isn't in the text, say so.\n"
                    "Return plain text without markdown formatting.\n\n"
                    f"Question: {body.question}\n\nPaper Text:\n{paper.extracted_text[:30000]}"
                )
                answer = gemini.analyze_text(prompt)
                return {"answer": answer, "contexts": []}
            else:
                return {"answer": "Paper not found or no text available.", "contexts": []}
        else:
            return {"answer": "Please upload a paper first to ask questions about it.", "contexts": []}
    except Exception as e:
        return {"answer": f"Error: {str(e)}", "contexts": []}

