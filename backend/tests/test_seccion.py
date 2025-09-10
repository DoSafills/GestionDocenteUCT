from app.infrastructure.repositories.seccion_repo import SeccionRepository
from app.infrastructure.repositories.asignatura_repo import AsignaturaRepository
from app.domain.models.seccion import Seccion
from app.domain.models.asignatura import Asignatura

def test_seccion_crud(session):
    AsignaturaRepository(session).add(Asignatura(codigo="MAT101", nombre="Algebra", creditos=6, tipo="TEORIA"))
    repo = SeccionRepository(session)
    s = Seccion(seccion_id="00000000-0000-0000-0000-000000000001", numero=1, codigo="MAT101-1-2025-1", anio=2025, semestre=1, asignatura_codigo="MAT101", cupos=30)
    repo.add(s); session.flush()
    assert repo.get("00000000-0000-0000-0000-000000000001").numero == 1
