from app.infrastructure.repositories.docente_repo import DocenteRepository
from app.domain.models.docente import Docente

def test_docente_crud(session):
    repo = DocenteRepository(session)
    d = Docente(docente_rut="1-9", nombre="Ana", email="ana@uct.cl", max_horas_docencia=40)
    repo.add(d); session.flush()
    assert repo.get("1-9").nombre == "Ana"
