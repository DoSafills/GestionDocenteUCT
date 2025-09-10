"""Service for Bloque application use-cases."""
from sqlalchemy.orm import Session
from ...infrastructure.repositories.bloque_repo import BloqueRepository
from ...domain.schemas.bloque import BloqueIn, BloqueOut
from ...domain.models.bloque import Bloque

class BloqueService:
    def __init__(self, session: Session) -> None:
        self.repo = BloqueRepository(session)

    def create(self, data: BloqueIn) -> BloqueOut:
        obj = Bloque(**data.dict())
        self.repo.add(obj)
        return BloqueOut.model_validate(obj)

    def get(self, pk) -> BloqueOut | None:
        obj = self.repo.get(pk)
        return BloqueOut.model_validate(obj) if obj else None

    def list(self) -> list[BloqueOut]:
        return [BloqueOut.model_validate(o) for o in self.repo.list()]
