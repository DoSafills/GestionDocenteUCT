from app.infrastructure.repositories.clase_repo import ClaseRepository
from app.infrastructure.repositories.docente_repo import DocenteRepository
from app.infrastructure.repositories.sala_repo import SalaRepository
from app.infrastructure.repositories.bloque_repo import BloqueRepository
from app.infrastructure.repositories.seccion_repo import SeccionRepository
from app.infrastructure.repositories.asignatura_repo import AsignaturaRepository
from app.domain.models.docente import Docente
from app.domain.models.sala import Sala, TipoSala, EstadoSala
from app.domain.models.bloque import Bloque
from app.domain.models.seccion import Seccion
from app.domain.models.asignatura import Asignatura
from app.domain.models.clase import Clase
from datetime import time

def test_clase_crud(session):
    DocenteRepository(session).add(Docente(docente_rut="1-1", nombre="Ana", email="ana@uct.cl", max_horas_docencia=40))
    SalaRepository(session).add(Sala(codigo="C", numero="101", capacidad=40, tipo=TipoSala.AULA, piso="1", estado=EstadoSala.DISPONIBLE, edificio_codigo="ED1"))
    BloqueRepository(session).add(Bloque(bloque_id=90900, dia_semana=1, hora_inicio=time(8,0), hora_fin=time(9,30)))
    AsignaturaRepository(session).add(Asignatura(codigo="MAT101", nombre="Algebra", creditos=6, tipo="TEORIA"))
    SeccionRepository(session).add(Seccion(seccion_id="sec1", numero=1, codigo="MAT101-1-2025-1", anio=2025, semestre=1, asignatura_codigo="MAT101", cupos=30))
    session.flush()
    repo = ClaseRepository(session)
    c = Clase(seccion_id="sec1", docente_rut="1-1", sala_codigo="C", bloque_id=90900)
    repo.add(c); session.flush()
    assert c.clase_id is not None
