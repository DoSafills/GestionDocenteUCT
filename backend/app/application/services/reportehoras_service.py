"""Service for ReporteDetalleHoras application use-cases."""
from sqlalchemy.orm import Session
from ...infrastructure.repositories.reportehoras_repo import ReporteDetalleHorasRepository
from ...domain.schemas.reportehoras import ReporteDetalleHorasIn, ReporteDetalleHorasOut
from ...domain.models.reportehoras import ReporteDetalleHoras

class ReporteDetalleHorasService:
    def __init__(self, session: Session) -> None:
        self.repo = ReporteDetalleHorasRepository(session)

    def create(self, data: ReporteDetalleHorasIn) -> ReporteDetalleHorasOut:
        obj = ReporteDetalleHoras(**data.dict())
        self.repo.add(obj)
        return ReporteDetalleHorasOut.model_validate(obj)

    def get(self, pk) -> ReporteDetalleHorasOut | None:
        obj = self.repo.get(pk)
        return ReporteDetalleHorasOut.model_validate(obj) if obj else None

    def list(self) -> list[ReporteDetalleHorasOut]:
        return [ReporteDetalleHorasOut.model_validate(o) for o in self.repo.list()]
