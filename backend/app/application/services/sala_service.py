"""Domain-specific room availability service."""
from sqlalchemy import select
from sqlalchemy.orm import Session
from ...domain.models.sala import Sala, TipoSala
from ...domain.models.clase import Clase

def salas_disponibles_para_bloque(session: Session, bloque_id: int, capacidad_minima: int = 1, tipo: TipoSala | None = None):
    ocupadas = select(Clase.sala_codigo).where(Clase.bloque_id == bloque_id)
    stmt = select(Sala).where(Sala.capacidad >= capacidad_minima).where(~Sala.codigo.in_(ocupadas)).order_by(Sala.capacidad.asc())
    if tipo is not None:
        stmt = stmt.where(Sala.tipo == tipo)
    return session.scalars(stmt).all()
