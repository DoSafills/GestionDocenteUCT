"""Service for Docente application use-cases."""
from sqlalchemy.orm import Session
from ...infrastructure.repositories.docente_repo import DocenteRepository
from ...domain.schemas.docente import DocenteIn, DocenteOut
from ...domain.models.docente import Docente

class DocenteService:
    def __init__(self, session: Session) -> None:
        self.repo = DocenteRepository(session)

    def create(self, data: DocenteIn) -> DocenteOut:
        obj = Docente(**data.dict())
        self.repo.add(obj)
        return DocenteOut.model_validate(obj)

    def get(self, pk) -> DocenteOut | None:
        obj = self.repo.get(pk)
        return DocenteOut.model_validate(obj) if obj else None

    def list(self) -> list[DocenteOut]:
        return [DocenteOut.model_validate(o) for o in self.repo.list()]
