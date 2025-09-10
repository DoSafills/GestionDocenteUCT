"""Repository for Campus."""
from .base import Repository
from ..domain.models.campus import Campus
from sqlalchemy.orm import Session

class CampusRepository(Repository[Campus]):
    def __init__(self, session: Session) -> None:
        super().__init__(Campus, session)
