from typing import Generic, TypeVar
from sqlalchemy.orm.session import Session

from models.base import BaseModel
from schema.user import BaseUser as BaseSchema

Model = TypeVar("Model", bound=BaseModel)
Schema = TypeVar("Dto", bound=BaseSchema)

class CRUD(Generic[Model, Schema]):
    def __init__(self, session: Session, model_cls: type[Model], dto_cls: type[Schema]):
        self.session = session
        self.model_cls = model_cls
        self.dto_cls = dto_cls
        
    def create(self, data: BaseSchema):
        model = self.model_cls.from_dict(data)
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)

        return model

    def update(self, data: BaseSchema):
        model = self.session.query(self.model_cls).get(data.id)
        if not model:
            raise Exception(f"Model with ID {id} not found")

        update_data = data.model_dump()
        for field in update_data:
            setattr(model, field, update_data[field])

        self.session.commit()
        self.session.refresh(model)

        return model