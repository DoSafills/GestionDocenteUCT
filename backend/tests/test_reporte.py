from app.infrastructure.repositories.reporte_repo import ReporteRepository
from app.domain.models.reporte import Reporte, TipoReporte
from datetime import datetime

def test_reporte_crud(session):
    repo = ReporteRepository(session)
    r = Reporte(reporte_id="rep1", tipo=TipoReporte.HORAS_DOCENTE, generado_en=datetime.utcnow(), generado_por="tester", comentario=None)
    repo.add(r); session.flush()
    assert repo.get("rep1").tipo.name == "HORAS_DOCENTE"
