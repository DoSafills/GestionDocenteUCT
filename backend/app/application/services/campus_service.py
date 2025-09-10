"""Service for Campus application use-cases."""
from sqlalchemy.orm import Session
from ...infrastructure.repositories.campus_repo import CampusRepository
from ...domain.schemas.campus import CampusIn, CampusOut
from ...domain.models.campus import Campus

class CampusService:
    def __init__(self, session: Session) -> None:
        self.repo = CampusRepository(session)

    def create(self, data: CampusIn) -> CampusOut:
        obj = Campus(**data.dict())
        self.repo.add(obj)
        return CampusOut.model_validate(obj)

    def get(self, pk) -> CampusOut | None:
        obj = self.repo.get(pk)
        return CampusOut.model_validate(obj) if obj else None

    def list(self) -> list[CampusOut]:
        return [CampusOut.model_validate(o) for o in self.repo.list()]
