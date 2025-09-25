from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .settings import settings
from .db import init_db
from .routers import auth, papers, analytics, agent as agent_router, rag as rag_router

app = FastAPI(title="ResearchPal AI 2.0 – The AI Research Co-pilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(papers.router, tags=["papers"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(agent_router.router, tags=["agent"])
app.include_router(rag_router.router, tags=["rag"])

