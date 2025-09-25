from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select

from ..auth import get_session, get_password_hash, verify_password, create_access_token, get_current_user
from ..models import User


router = APIRouter()


class SignupPayload(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
def signup(payload: SignupPayload, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=payload.email, hashed_password=get_password_hash(payload.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    token = create_access_token(user.email)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "xp": user.xp, "is_admin": user.is_admin}}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token(user.email)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "xp": user.xp, "is_admin": user.is_admin}}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "xp": user.xp, "is_admin": user.is_admin, "specialty": user.specialty}

