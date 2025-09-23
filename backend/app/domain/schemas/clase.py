"""Pydantic schemas for Clase."""
from pydantic import BaseModel
from ..models.clase import EstadoClase

class ClaseIn(BaseModel):
    seccion_id: str
    docente_rut: str
    sala_codigo: str
    bloque_id: int
    estado: EstadoClase = EstadoClase.PROPUESTO

class ClaseOut(BaseModel):
    clase_id: int
    seccion_id: str
    docente_rut: str
    sala_codigo: str
    bloque_id: int
    estado: EstadoClase
    class Config:
        from_attributes = True
