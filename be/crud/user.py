from sqlalchemy.orm import Session

from models.user import UserModel
from schema.user import UserSignUp, UserSignIn, BaseUser
from crud.base import CRUD

class UserCRUD(CRUD[UserModel, BaseUser]):
    def __init__(self, session: Session):
        super().__init__(session, UserModel, BaseUser)

    def create_user(self, user_data: BaseUser):
        return self.create(user_data)
    
    def get_user_by_email(self, email: str):
        user = self.session.query(UserModel).filter_by(email=email).first()
        if not user:
            raise Exception(f"User with email {email} not found")
        return user

    def delete_user(self, user_id: str) -> None:
        user = self.session.query(UserModel).get(user_id)
        if not user:
            raise Exception(f"User with ID {user_id} not found")
        self.session.delete(user)
        self.session.commit()
