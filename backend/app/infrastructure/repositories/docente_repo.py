"""Repository for Docente."""
from .base import Repository
from ..domain.models.docente import Docente
from sqlalchemy.orm import Session

class DocenteRepository(Repository[Docente]):
    def __init__(self, session: Session) -> None:
        super().__init__(Docente, session)
