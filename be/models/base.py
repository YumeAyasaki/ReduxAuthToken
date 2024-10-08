import datetime
from sqlalchemy import func, MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, registry

convention = {
    "ix": "ix_%(column_0_label)s",  # INDEX
    "uq": "uq_%(table_name)s_%(column_0_N_name)s",  # UNIQUE
    "ck": "ck_%(table_name)s_%(constraint_name)s",  # CHECK
    "fk": "fk_%(table_name)s_%(column_0_N_name)s_%(referred_table_name)s",  # FOREIGN KEY
    "pk": "pk_%(table_name)s",  # PRIMARY KEY
}

mapper_registry = registry(metadata=MetaData(naming_convention=convention))

class BaseModel(DeclarativeBase):
    registry = mapper_registry
    metadata = mapper_registry.metadata
    id: Mapped[str] = mapped_column(primary_key=True, server_default=func.gen_random_uuid())
    
    def to_dict(self) -> dict:
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}
    
    @classmethod
    def from_dict(cls, data: dict) -> "BaseModel":
        instance = cls()
        for key, value in data:
            if key != 'id' and not getattr(instance, key, None) :
                setattr(instance, key, value)
        return instance

class CreatedUpdatedAtMixin(BaseModel):
    """
    A model mixin that adds `created_at` and `updated_at` timestamp fields
    """
    __abstract__ = True

    created_at: Mapped[datetime.datetime] = mapped_column(
        nullable=False,
        server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    
    def to_dict(self):
        return {field.name:getattr(self, field.name) for field in self.__table__.c}