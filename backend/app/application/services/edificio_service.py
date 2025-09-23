"""Service for Edificio application use-cases."""
from sqlalchemy.orm import Session
from ...infrastructure.repositories.edificio_repo import EdificioRepository
from ...domain.schemas.edificio import EdificioIn, EdificioOut
from ...domain.models.edificio import Edificio

class EdificioService:
    def __init__(self, session: Session) -> None:
        self.repo = EdificioRepository(session)

    def create(self, data: EdificioIn) -> EdificioOut:
        obj = Edificio(**data.dict())
        self.repo.add(obj)
        return EdificioOut.model_validate(obj)

    def get(self, pk) -> EdificioOut | None:
        obj = self.repo.get(pk)
        return EdificioOut.model_validate(obj) if obj else None

    def list(self) -> list[EdificioOut]:
        return [EdificioOut.model_validate(o) for o in self.repo.list()]
