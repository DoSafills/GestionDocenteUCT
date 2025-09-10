"""Repository for Clase."""
from .base import Repository
from ..domain.models.clase import Clase
from sqlalchemy.orm import Session

class ClaseRepository(Repository[Clase]):
    def __init__(self, session: Session) -> None:
        super().__init__(Clase, session)
