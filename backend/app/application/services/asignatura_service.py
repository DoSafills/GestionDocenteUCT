"""Service for Asignatura application use-cases."""
from sqlalchemy.orm import Session
from ...infrastructure.repositories.asignatura_repo import AsignaturaRepository
from ...domain.schemas.asignatura import AsignaturaIn, AsignaturaOut
from ...domain.models.asignatura import Asignatura

class AsignaturaService:
    def __init__(self, session: Session) -> None:
        self.repo = AsignaturaRepository(session)

    def create(self, data: AsignaturaIn) -> AsignaturaOut:
        obj = Asignatura(**data.dict())
        self.repo.add(obj)
        return AsignaturaOut.model_validate(obj)

    def get(self, pk) -> AsignaturaOut | None:
        obj = self.repo.get(pk)
        return AsignaturaOut.model_validate(obj) if obj else None

    def list(self) -> list[AsignaturaOut]:
        return [AsignaturaOut.model_validate(o) for o in self.repo.list()]
