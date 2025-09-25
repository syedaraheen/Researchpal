from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables from a local .env file if present
load_dotenv()


class Settings(BaseModel):
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "43200"))
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    SEMANTIC_SCHOLAR_API_KEY: str | None = os.getenv("SEMANTIC_SCHOLAR_API_KEY")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./researchpal.db")
    BACKEND_CORS_ORIGINS: str = os.getenv(
        "BACKEND_CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"
    )
    GOOGLE_CLIENT_ID: str | None = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str | None = os.getenv("GOOGLE_CLIENT_SECRET")


settings = Settings()

