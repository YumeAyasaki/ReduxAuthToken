import jwt

from config import Settings

settings = Settings()

def encrypt(data):
    token = jwt.encode(data, settings.secret, algorithm='HS256')
    return token
    
def decrypt(data):
    data = jwt.decode(data, settings.secret, algorithms=['HS256'])
    return data

def verify_access_token(data):
    data = decrypt(data)
    expire = data['expire_at']