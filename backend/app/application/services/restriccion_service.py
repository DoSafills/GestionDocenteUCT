"""Domain-specific restriction evaluation service."""
from sqlalchemy import select
from sqlalchemy.orm import Session
from ...domain.models.restriccion import Restriccion, TipoRestriccion
from ...domain.models.bloque import Bloque

def bloque_restringido_para_docente(session: Session, docente_rut: str, bloque_id: int) -> tuple[bool, str | None]:
    b = session.get(Bloque, bloque_id)
    if b is None:
        return True, "Bloque inexistente"
    res = session.scalars(select(Restriccion).where(Restriccion.docente_rut==docente_rut, Restriccion.tipo==TipoRestriccion.NoDisponible)).all()
    for r in res:
        v = (r.valor or "").upper().strip()
        if v == f"BLOQUE:{bloque_id}":
            return True, "No disponible por bloque"
        if v == f"DIA:{b.dia_semana}":
            return True, "No disponible por día"
    return False, None
