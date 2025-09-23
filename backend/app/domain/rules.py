"""Business rules and validations for domain entities."""
from sqlalchemy import select
from sqlalchemy.orm import Session
from .models.clase import Clase
from .models.seccion import Seccion
from .models.sala import Sala

def validar_capacidad_vs_cupos(session: Session, seccion_id: str, sala_codigo: str) -> None:
    """Ensure the room capacity >= section seats."""
    seccion = session.get(Seccion, seccion_id)
    sala = session.get(Sala, sala_codigo)
    if not seccion or not sala:
        return
    if seccion.cupos > sala.capacidad:
        raise ValueError("Capacidad insuficiente para la sección")

def validar_colisiones(session: Session, seccion_id: str, docente_rut: str, sala_codigo: str, bloque_id: int) -> None:
    """Check collisions for teacher, room, and section at the same block."""
    if session.scalar(select(Clase.clase_id).where(Clase.docente_rut==docente_rut, Clase.bloque_id==bloque_id)):
        raise ValueError("Docente ocupado en el bloque")
    if session.scalar(select(Clase.clase_id).where(Clase.sala_codigo==sala_codigo, Clase.bloque_id==bloque_id)):
        raise ValueError("Sala ocupada en el bloque")
    if session.scalar(select(Clase.clase_id).where(Clase.seccion_id==seccion_id, Clase.bloque_id==bloque_id)):
        raise ValueError("Sección ya asignada en el bloque")
