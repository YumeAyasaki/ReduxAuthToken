import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from .base import CreatedUpdatedAtMixin

class UserModel(CreatedUpdatedAtMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(120), nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(50), nullable=False)

    def __repr__(self) -> str:
        return f"<User(username={self.username}, email={self.email}>"