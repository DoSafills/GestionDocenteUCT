"""Service for Seccion application use-cases."""
from sqlalchemy.orm import Session
from ...infrastructure.repositories.seccion_repo import SeccionRepository
from ...domain.schemas.seccion import SeccionIn, SeccionOut
from ...domain.models.seccion import Seccion

class SeccionService:
    def __init__(self, session: Session) -> None:
        self.repo = SeccionRepository(session)

    def create(self, data: SeccionIn) -> SeccionOut:
        obj = Seccion(**data.dict())
        self.repo.add(obj)
        return SeccionOut.model_validate(obj)

    def get(self, pk) -> SeccionOut | None:
        obj = self.repo.get(pk)
        return SeccionOut.model_validate(obj) if obj else None

    def list(self) -> list[SeccionOut]:
        return [SeccionOut.model_validate(o) for o in self.repo.list()]
