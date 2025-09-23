from app.infrastructure.repositories.edificio_repo import EdificioRepository
from app.infrastructure.repositories.campus_repo import CampusRepository
from app.domain.models.edificio import Edificio
from app.domain.models.campus import Campus

def test_edificio_crud(session):
    CampusRepository(session).add(Campus(codigo="CJP", nombre="Juan Pablo"))
    repo = EdificioRepository(session)
    e = Edificio(codigo="CJP01", numero="01", nombre="FAAD", campus_codigo="CJP")
    repo.add(e); session.flush()
    assert repo.get("CJP01").nombre == "FAAD"
