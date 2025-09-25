from sqlmodel import SQLModel, create_engine
from .settings import settings


engine = create_engine(settings.DATABASE_URL, echo=False)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)

