"""Service for Reporte application use-cases."""
from sqlalchemy.orm import Session
from ...infrastructure.repositories.reporte_repo import ReporteRepository
from ...domain.schemas.reporte import ReporteIn, ReporteOut
from ...domain.models.reporte import Reporte

class ReporteService:
    def __init__(self, session: Session) -> None:
        self.repo = ReporteRepository(session)

    def create(self, data: ReporteIn) -> ReporteOut:
        obj = Reporte(**data.dict())
        self.repo.add(obj)
        return ReporteOut.model_validate(obj)

    def get(self, pk) -> ReporteOut | None:
        obj = self.repo.get(pk)
        return ReporteOut.model_validate(obj) if obj else None

    def list(self) -> list[ReporteOut]:
        return [ReporteOut.model_validate(o) for o in self.repo.list()]
