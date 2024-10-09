from fastapi import APIRouter, Depends, Request
from datetime import datetime, timedelta
from fastapi import Depends

from crud.user import UserCRUD
from database import get_db
from utils.token import encrypt, decrypt
from utils.auth import has_access

router = APIRouter()
user_crud = UserCRUD(next(get_db()))

@router.get('/secret/')
async def check(payload=Depends(has_access)):
    expire_at = datetime.fromisoformat(payload['expire_at'])
    if datetime.now() > expire_at:
        return {'Expired access token. Request refresh'}
    
    return {'Something'}

@router.post('/refresh/')
async def refresh(request_data: Request):
    data = await request_data.json()
    data = decrypt(data['refresh_token'])
    expire_at = datetime.fromisoformat(data['expire_at'])
    if datetime.now() > expire_at:
        return {'message': 'Expired refresh token. Log out.'}
    user = None
    # New access token
    try:
        user = user_crud.get_user_by_email(data['email'])
        
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