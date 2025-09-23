"""Repository for Sala."""
from .base import Repository
from ..domain.models.sala import Sala
from sqlalchemy.orm import Session

class SalaRepository(Repository[Sala]):
    def __init__(self, session: Session) -> None:
        super().__init__(Sala, session)
