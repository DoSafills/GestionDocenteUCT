from app.infrastructure.repositories.bloque_repo import BloqueRepository
from app.domain.models.bloque import Bloque
from datetime import time

def test_bloque_crud(session):
    repo = BloqueRepository(session)
    b = Bloque(bloque_id=10100, dia_semana=1, hora_inicio=time(8,0), hora_fin=time(9,30))
    repo.add(b); session.flush()
    assert repo.get(10100).dia_semana == 1
