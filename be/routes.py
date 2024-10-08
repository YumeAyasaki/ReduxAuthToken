from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.exc import DataError, SQLAlchemyError

from schema.user import UserSignIn, UserSignUp
from crud.user import UserCRUD
from database import get_db
from utils.token import encrypt, decrypt

router = APIRouter()

@router.get("/")
async def test():
    return {"message": "Probably working"}

@router.get("/test/")
async def test():
    return {"message": "Hello World"}

# Auth
user_crud = UserCRUD(next(get_db()))

@router.post('/login/')
async def signin(request_data: UserSignIn):
    print(request_data)
    try:
        user = user_crud.get_user_by_email(request_data.email)
        print(user)
        
        # Check password
        if user.password != request_data.password:
            return Response('Wrong password', status_code=500)
        
        
    except SQLAlchemyError as err:
        print(err)
        return Response('Something wrong here.', status_code=500)
    user = user.to_dict()
    user.pop('created_at', None)
    user.pop('updated_at', None)
    print(user)
        
    access_token = encrypt(user)
    refresh_token = encrypt(user)
    res = {
        'message': 'Successfully log in.',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'username': user['username'],
    }
    return res

@router.post('/register/')
async def signup(request_data: UserSignUp):
    print(request_data)
    try:
        user_crud.create_user(request_data)
    except SQLAlchemyError as err:
        print(err)
        return Response('Something wrong here.', status_code=500)
    return Response('Successfully create user.', status_code=201)