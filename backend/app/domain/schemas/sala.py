"""Pydantic schemas for Sala."""
from pydantic import BaseModel, Field
from typing import Optional
from ..models.sala import TipoSala, EstadoSala

class SalaIn(BaseModel):
    codigo: str
    numero: str
    capacidad: int = Field(ge=1)
    tipo: TipoSala
    piso: Optional[str] = None
    estado: EstadoSala = EstadoSala.DISPONIBLE
    edificio_codigo: str

class SalaOut(BaseModel):
    codigo: str
    numero: str
    capacidad: int
    tipo: TipoSala
    piso: str | None
    estado: EstadoSala
    edificio_codigo: str
    class Config:
        from_attributes = True
