"""Repository for Edificio."""
from .base import Repository
from ..domain.models.edificio import Edificio
from sqlalchemy.orm import Session

class EdificioRepository(Repository[Edificio]):
    def __init__(self, session: Session) -> None:
        super().__init__(Edificio, session)
