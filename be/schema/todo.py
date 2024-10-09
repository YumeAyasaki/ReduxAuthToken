from pydantic import BaseModel

class BaseTodo(BaseModel):
    task_name: str
    status: bool
    user_id: str