from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.exc import DataError, SQLAlchemyError
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

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
    print(request_data)
    try:
        user_crud.create_user(request_data)
    except SQLAlchemyError as err:
        print(err)
        return Response('Something wrong here.', status_code=500)
    return Response('Successfully create user.', status_code=201)

# Secret thing
security = HTTPBearer()

async def has_access(credentials: HTTPAuthorizationCredentials= Depends(security)):
    """
        Function that is used to validate the token in the case that it requires it
    """
    token = credentials.credentials

    try:
        payload = decrypt(token)
        return payload
    except:  # catches any exception
        raise HTTPException(status_code=401)

@router.get('/secret/')
async def check(payload=Depends(has_access)):
    # print(request_data)
    expire_at = datetime.fromisoformat(payload['expire_at'])
    if datetime.now() > expire_at:
        return {'Expired access token. Request refresh'}
    
    return {'Something'}

@router.post('/refresh/')
async def refresh(request_data: Request):
    data = await request_data.json()
    print(data)
    data = decrypt(data['refresh_token'])
    print(data)
    expire_at = datetime.fromisoformat(data['expire_at'])
    if datetime.now() > expire_at:
        return {'message': 'Expired refresh token. Log out.'}
    user = None
    # New access token
    try:
        user = user_crud.get_user_by_email(data['email'])
        print(user)
        
    except:
        return {'message': 'Something wrong.'}
    
    user = user.to_dict()
    user.pop('created_at', None)
    user.pop('updated_at', None)
    access_token = user.copy()
    access_token['expire_at'] = datetime.now() + timedelta(seconds=30)
    access_token['expire_at'] = access_token['expire_at'].isoformat()
    access_token = encrypt(access_token)
    
    return {'access_token': access_token}