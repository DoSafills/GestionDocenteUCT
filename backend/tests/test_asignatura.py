from app.infrastructure.repositories.asignatura_repo import AsignaturaRepository
from app.domain.models.asignatura import Asignatura

def test_asignatura_crud(session):
    repo = AsignaturaRepository(session)
    a = Asignatura(codigo="MAT101", nombre="Algebra", creditos=6, tipo="TEORIA")
    repo.add(a); session.flush()
    assert repo.get("MAT101").nombre == "Algebra"
