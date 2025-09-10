"""Class assignment domain service."""
from sqlalchemy import select
from sqlalchemy.orm import Session
from ...domain.models.clase import Clase, EstadoClase
from ...domain.models.sala import Sala
from ...domain.models.seccion import Seccion
from ...domain.models.docente import Docente
from .restriccion_service import bloque_restringido_para_docente
from ...domain.rules import validar_capacidad_vs_cupos, validar_colisiones

class HorarioError(ValueError):
    """Business error when scheduling classes."""

def proponer_clase(session: Session, seccion_id: str, docente_rut: str, sala_codigo: str, bloque_id: int) -> Clase:
    seccion = session.get(Seccion, seccion_id)
    sala = session.get(Sala, sala_codigo)
    docente = session.get(Docente, docente_rut)
    if not seccion or not sala or not docente:
        raise HorarioError("Entidad inválida")
    validar_capacidad_vs_cupos(session, seccion_id, sala_codigo)
    validar_colisiones(session, seccion_id, docente_rut, sala_codigo, bloque_id)
    rest, motivo = bloque_restringido_para_docente(session, docente_rut, bloque_id)
    if rest:
        raise HorarioError(motivo or "Bloque restringido")
    c = Clase(seccion_id=seccion_id, docente_rut=docente_rut, sala_codigo=sala_codigo, bloque_id=bloque_id, estado=EstadoClase.PROPUESTO)
    session.add(c)
    session.flush()
    return c

def activar_clase(session: Session, clase_id: int) -> Clase:
    c = session.get(Clase, clase_id)
    if not c:
        raise HorarioError("Clase no encontrada")
    c.estado = EstadoClase.ACTIVO
    session.flush()
    return c

def cancelar_clase(session: Session, clase_id: int) -> Clase:
    c = session.get(Clase, clase_id)
    if not c:
        raise HorarioError("Clase no encontrada")
    c.estado = EstadoClase.SUSPENDIDO
    session.flush()
    return c
