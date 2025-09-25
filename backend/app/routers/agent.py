from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..agent import decide_and_run, simulate_debate, generate_timeline
from ..auth import get_current_user, get_session
from sqlmodel import Session
from ..models import User
from ..services import research
from ..settings import settings


router = APIRouter()


class IntentPayload(BaseModel):
    intent: str
    payload: Dict[str, Any] = {}


@router.post("/agent")
async def agent_endpoint(body: IntentPayload, user: User = Depends(get_current_user)):
    result = await decide_and_run(body.intent, body.payload)
    return result


class DebatePayload(BaseModel):
    a_abstract: str
    b_abstract: str
    a_cite: Optional[str] = None
    b_cite: Optional[str] = None


@router.post("/debate")
def debate(body: DebatePayload, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    transcript = simulate_debate(body.a_abstract, body.b_abstract, body.a_cite, body.b_cite)
    # grant XP
    user.xp += 20
    session.add(user)
    session.commit()
    return {"transcript": transcript, "xp": user.xp}


class TimelinePayload(BaseModel):
    topic: str


@router.post("/timeline")
async def timeline(body: TimelinePayload):
    data = await generate_timeline(body.topic)
    return data


@router.get("/graph/{paper_id}")
async def graph(paper_id: str):
    data = await research.paper_with_citations(paper_id, api_key=settings.SEMANTIC_SCHOLAR_API_KEY)
    nodes = [{"data": {"id": data.get("paperId", paper_id), "label": data.get("title", "Paper")}}]
    edges = []
    for ref in (data.get("references") or []):
        rid = ref.get("paperId")
        if not rid: continue
        nodes.append({"data": {"id": rid, "label": ref.get("title", "Ref")}})
        edges.append({"data": {"source": data.get("paperId", paper_id), "target": rid}})
    for cit in (data.get("citations") or []):
        cid = cit.get("paperId")
        if not cid: continue
        nodes.append({"data": {"id": cid, "label": cit.get("title", "Cite")}})
        edges.append({"data": {"source": cid, "target": data.get("paperId", paper_id)}})
    # de-duplicate nodes by id
    uniq = {}
    for n in nodes:
        uniq[n["data"]["id"]] = n
    return {"elements": {"nodes": list(uniq.values()), "edges": edges}}

