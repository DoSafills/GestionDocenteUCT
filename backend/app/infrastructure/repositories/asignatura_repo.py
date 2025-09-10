"""Repository for Asignatura."""
from .base import Repository
from ..domain.models.asignatura import Asignatura
from sqlalchemy.orm import Session

class AsignaturaRepository(Repository[Asignatura]):
    def __init__(self, session: Session) -> None:
        super().__init__(Asignatura, session)
