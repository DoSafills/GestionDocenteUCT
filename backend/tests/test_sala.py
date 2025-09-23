from app.infrastructure.repositories.sala_repo import SalaRepository
from app.infrastructure.repositories.edificio_repo import EdificioRepository
from app.infrastructure.repositories.campus_repo import CampusRepository
from app.domain.models.sala import Sala, TipoSala, EstadoSala
from app.domain.models.edificio import Edificio
from app.domain.models.campus import Campus

def test_sala_crud(session):
    CampusRepository(session).add(Campus(codigo="CJP", nombre="Juan Pablo"))
    EdificioRepository(session).add(Edificio(codigo="CJP01", numero="01", nombre="FAAD", campus_codigo="CJP"))
    repo = SalaRepository(session)
    s = Sala(codigo="CJP01_125", numero="125", capacidad=40, tipo=TipoSala.AULA, piso="1", estado=EstadoSala.DISPONIBLE, edificio_codigo="CJP01")
    repo.add(s); session.flush()
    assert repo.get("CJP01_125").capacidad == 40
