from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Boolean, ForeignKey

from .base import CreatedUpdatedAtMixin

class TodoModel(CreatedUpdatedAtMixin):
    __tablename__ = "todos"

    task_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, default=False)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)

    def __repr__(self) -> str:
        return f"<Todo(id={self.id}, task_name={self.task_name}, status={self.status})>"