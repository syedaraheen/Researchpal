from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    is_admin: bool = Field(default=False)
    xp: int = Field(default=0)
    specialty: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    papers: List["Paper"] = Relationship(back_populates="owner")


class Paper(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    title: Optional[str] = None
    source: Optional[str] = None  # 'upload' | 'semantic_scholar' | 'arxiv'
    external_id: Optional[str] = None
    metadata_json: Optional[str] = None
    extracted_text: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    owner: Optional["User"] = Relationship(back_populates="papers")


class Quest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(index=True, unique=True)
    title: str
    description: str
    xp_reward: int = Field(default=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserQuest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    quest_id: int = Field(foreign_key="quest.id")
    progress: int = Field(default=0)
    completed: bool = Field(default=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Achievement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(index=True, unique=True)
    title: str
    description: str


class UserAchievement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    achievement_id: int = Field(foreign_key="achievement.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

