"""Pydantic schemas for Seccion."""
from pydantic import BaseModel, Field

class SeccionIn(BaseModel):
    seccion_id: str
    numero: int = Field(ge=1)
    codigo: str | None = None
    anio: int = Field(ge=2000, le=2100)
    semestre: int = Field(ge=1, le=2)
    asignatura_codigo: str
    cupos: int = Field(ge=1)

class SeccionOut(BaseModel):
    seccion_id: str
    numero: int
    codigo: str | None
    anio: int
    semestre: int
    asignatura_codigo: str
    cupos: int
    class Config:
        from_attributes = True
