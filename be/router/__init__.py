from fastapi import APIRouter

from .user import router as user_router
from .auth import router as auth_router
from .todo import router as todo_router

router = APIRouter()

router.include_router(user_router, prefix="/user")
router.include_router(auth_router, prefix='/auth')
router.include_router(todo_router, prefix='/todo')

@router.get("/")
async def test():
    return {"message": "Probably working"}

@router.get("/test/")
async def test():
    return {"message": "Hello World"}