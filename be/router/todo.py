from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.exc import SQLAlchemyError

from crud.user import UserCRUD
from crud.todo import TodoCRUD
from database import get_db
from utils.auth import has_access
from schema.todo import BaseTodo

router = APIRouter()
user_crud = UserCRUD(next(get_db()))
todo_crud = TodoCRUD(next(get_db()))

@router.get('/')
async def get_all(payload=Depends(has_access)):
    todos = todo_crud.get_all(payload['id'])
    return todos

@router.post('/add/')
async def add_one(request_data: Request, payload=Depends(has_access)):
    data = await request_data.json()
    try:
        new_todo = BaseTodo(
            task_name=data['taskName'],
            status=False,
            user_id=payload['id']
        )
        todo_crud.create_todo(new_todo)
    except SQLAlchemyError as err:
        print(err)
        return Response('Something wrong here.', status_code=500)
    return Response('Successfully add task.', status_code=201)

@router.post('/{id}/')
async def update_status(id: str, payload=Depends(has_access)):
    try:
        todo_crud.update_status(id)
        
    except SQLAlchemyError as err:
        print(err)
        return Response('Something wrong here.', status_code=500)
    return Response('Successfully edit task.', status_code=201)

@router.delete('/delete/{id}/')
async def delete(id: str, payload=Depends(has_access)):
    try:
        todo_crud.delete_todo(id)
        
    except SQLAlchemyError as err:
        print(err)
        return Response('Something wrong here.', status_code=500)
    return Response('Successfully delete task.', status_code=201)