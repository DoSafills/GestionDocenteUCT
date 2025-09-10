"""Pydantic schemas for Restriccion."""
from pydantic import BaseModel, Field
from ..models.restriccion import TipoRestriccion

class RestriccionIn(BaseModel):
    restriccion_id: str
    docente_rut: str
    tipo: TipoRestriccion
    operador: str | None = None
    valor: str
    prioridad: float = Field(ge=0, le=1, default=1.0)
    comentario: str | None = None

class RestriccionOut(BaseModel):
    restriccion_id: str
    docente_rut: str
    tipo: TipoRestriccion
    operador: str | None
    valor: str
    prioridad: float
    comentario: str | None
    class Config:
        from_attributes = True
