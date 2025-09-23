"""Repository for ReporteDetalleHoras."""
from .base import Repository
from ..domain.models.reportehoras import ReporteDetalleHoras
from sqlalchemy.orm import Session

class ReporteDetalleHorasRepository(Repository[ReporteDetalleHoras]):
    def __init__(self, session: Session) -> None:
        super().__init__(ReporteDetalleHoras, session)
