import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import CreatedUpdatedAtMixin

class UserModel(CreatedUpdatedAtMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(120), nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(50), nullable=False)
    
    todos: Mapped[list["TodoModel"]] = relationship("TodoModel", backref="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User(username={self.username}, email={self.email}>"