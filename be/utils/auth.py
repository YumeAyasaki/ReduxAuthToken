from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from datetime import datetime

from utils.token import encrypt, decrypt

security = HTTPBearer()

async def has_access(credentials: HTTPAuthorizationCredentials= Depends(security)):
    """
        Function that is used to validate the token in the case that it requires it
    """
    token = credentials.credentials

    try:
        payload = decrypt(token)
        expire_at = datetime.fromisoformat(payload['expire_at'])
        if datetime.now() > expire_at:
            raise HTTPException(status_code=401)
        return payload
    except:  # catches any exception
        raise HTTPException(status_code=401)