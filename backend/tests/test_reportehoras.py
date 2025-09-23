from app.infrastructure.repositories.reportehoras_repo import ReporteDetalleHorasRepository
from app.infrastructure.repositories.reporte_repo import ReporteRepository
from app.infrastructure.repositories.docente_repo import DocenteRepository
from app.domain.models.reportehoras import ReporteDetalleHoras
from app.domain.models.reporte import Reporte, TipoReporte
from app.domain.models.docente import Docente
from datetime import datetime

def test_reportehoras_crud(session):
    ReporteRepository(session).add(Reporte(reporte_id="rep2", tipo=TipoReporte.HORAS_DOCENTE, generado_en=datetime.utcnow(), generado_por="tester"))
    DocenteRepository(session).add(Docente(docente_rut="4-4", nombre="Ro", email="ro@uct.cl", max_horas_docencia=10))
    repo = ReporteDetalleHorasRepository(session)
    rh = ReporteDetalleHoras(reporte_id="rep2", docente_rut="4-4", horas_asignadas=10.0, max_horas=10.0, exceso=0.0, estado="OK")
    repo.add(rh); session.flush()
    assert repo.get(("rep2","4-4")).estado == "OK"
