from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func

from ..auth import get_session, require_admin
from ..models import User, Paper


router = APIRouter()


@router.get("/stats")
def stats(_: User = Depends(require_admin), session: Session = Depends(get_session)):
    users_count = session.exec(select(func.count()).select_from(User)).one()
    papers_count = session.exec(select(func.count()).select_from(Paper)).one()
    return {
        "users": users_count,
        "papers": papers_count,
        "comparisons": 0,
        "api_usage": {"gemini": 0},
    }

