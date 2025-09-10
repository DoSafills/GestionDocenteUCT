"""Repository for Bloque."""
from .base import Repository
from ..domain.models.bloque import Bloque
from sqlalchemy.orm import Session

class BloqueRepository(Repository[Bloque]):
    def __init__(self, session: Session) -> None:
        super().__init__(Bloque, session)
