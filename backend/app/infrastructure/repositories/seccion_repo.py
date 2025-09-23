"""Repository for Seccion."""
from .base import Repository
from ..domain.models.seccion import Seccion
from sqlalchemy.orm import Session

class SeccionRepository(Repository[Seccion]):
    def __init__(self, session: Session) -> None:
        super().__init__(Seccion, session)
