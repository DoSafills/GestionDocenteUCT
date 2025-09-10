"""Repository for Restriccion."""
from .base import Repository
from ..domain.models.restriccion import Restriccion
from sqlalchemy.orm import Session

class RestriccionRepository(Repository[Restriccion]):
    def __init__(self, session: Session) -> None:
        super().__init__(Restriccion, session)
