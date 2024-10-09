from sqlalchemy.orm import Session

from models.todo import TodoModel
from schema.todo import BaseTodo
from crud.base import CRUD

class TodoCRUD(CRUD[TodoModel, BaseTodo]):
    def __init__(self, session: Session):
        super().__init__(session, TodoModel, BaseTodo)
        
    def get_all(self, user_id: str):
        todos = self.session.query(TodoModel).filter_by(user_id=user_id)
        return [todo for todo in todos]
        
    def create_todo(self, todo_data: BaseTodo):
        return self.create(todo_data)
    
    def get_todo_by_id(self, id: str):
        todo = self.session.query(TodoModel).filter_by(id=id).first()
        if not todo:
            raise Exception(f"Can't find todo with id {id}")
        return todo

    def delete_todo(self, todo_id: str) -> None:
        todo = self.session.query(TodoModel).get(todo_id)
        if not todo:
            raise Exception(f"Can't find todo with id {todo_id}")
        self.session.delete(todo)
        self.session.commit()
        
    def update_status(self, todo_id: str) -> None:
        todo = self.session.query(TodoModel).get(todo_id)
        if not todo:
            raise Exception(f"Can't find todo with id {todo_id}")
        todo.status = not todo.status
        self.session.commit()