from pydantic import BaseModel, Field, EmailStr

class BaseUser(BaseModel):
    email: str = EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)

class UserSignUp(BaseModel):
    email: str = EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)

class UserSignIn(BaseModel):
    email: str = EmailStr
    password: str = Field(..., min_length=8, max_length=100)

class RefreshSchema(BaseModel):
    refresh_token: str