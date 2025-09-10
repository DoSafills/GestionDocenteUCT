from app.infrastructure.repositories.restriccion_repo import RestriccionRepository
from app.infrastructure.repositories.docente_repo import DocenteRepository
from app.domain.models.restriccion import Restriccion, TipoRestriccion
from app.domain.models.docente import Docente

def test_restriccion_crud(session):
    DocenteRepository(session).add(Docente(docente_rut="2-7", nombre="Luis", email="luis@uct.cl", max_horas_docencia=20))
    repo = RestriccionRepository(session)
    r = Restriccion(restriccion_id="00000000-0000-0000-0000-000000000003", docente_rut="2-7", tipo=TipoRestriccion.NoDisponible, operador="=", valor="BLOQUE:10100", prioridad=1.0)
    repo.add(r); session.flush()
    assert repo.get("00000000-0000-0000-0000-000000000003").tipo.name == "NoDisponible"
