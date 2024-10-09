from fastapi import APIRouter, Response
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta

from schema.user import UserSignIn, UserSignUp
from crud.user import UserCRUD
from database import get_db
from utils.token import encrypt

router = APIRouter()
user_crud = UserCRUD(next(get_db()))

@router.post('/login/')
async def signin(request_data: UserSignIn):
    try:
        user = user_crud.get_user_by_email(request_data.email)
        
        # Check password
        if user.password != request_data.password:
            return Response('Wrong password', status_code=500)
        
        
    except SQLAlchemyError as err:
        print(err)
        return Response('Something wrong here.', status_code=500)
    user = user.to_dict()
    user.pop('created_at', None)
    user.pop('updated_at', None)
    
    access_token = user.copy()
    access_token['expire_at'] = datetime.now() + timedelta(seconds=30)
    access_token['expire_at'] = access_token['expire_at'].isoformat()
    
    refresh_token = user.copy()
    refresh_token['expire_at'] = datetime.now() + timedelta(days=30)
    refresh_token['expire_at'] = refresh_token['expire_at'].isoformat()

    access_token = encrypt(access_token)
    refresh_token = encrypt(refresh_token)
    res = {
        'message': 'Successfully log in.',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'username': user['username'],
    }
    return res

@router.post('/register/')
async def signup(request_data: UserSignUp):
    try:
        user_crud.create_user(request_data)
    except SQLAlchemyError as err:
        print(err)
        return Response('Something wrong here.', status_code=500)
    return Response('Successfully create user.', status_code=201)

