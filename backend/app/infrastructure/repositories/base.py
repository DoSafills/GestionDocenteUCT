"""Generic repository implementation."""
from typing import Generic, TypeVar, Type, Iterable
from sqlalchemy.orm import Session
from sqlalchemy import select

T = TypeVar("T")

class Repository(Generic[T]):
    """Basic CRUD repository using SQLAlchemy Session."""
    def __init__(self, model: Type[T], session: Session) -> None:
        self.model = model
        self.session = session

    def add(self, obj: T) -> T:
        self.session.add(obj)
        return obj

    def get(self, pk) -> T | None:
        return self.session.get(self.model, pk)

    def list(self) -> Iterable[T]:
        return self.session.scalars(select(self.model)).all()

    def delete(self, obj: T) -> None:
        self.session.delete(obj)
