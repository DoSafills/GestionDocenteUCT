"""Repository for Reporte."""
from .base import Repository
from ..domain.models.reporte import Reporte
from sqlalchemy.orm import Session

class ReporteRepository(Repository[Reporte]):
    def __init__(self, session: Session) -> None:
        super().__init__(Reporte, session)
