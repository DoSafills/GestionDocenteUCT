"""Pydantic schemas for Asignatura."""
from pydantic import BaseModel, Field

class AsignaturaIn(BaseModel):
    codigo: str
    nombre: str
    creditos: int = Field(ge=1, le=44)
    tipo: str

class AsignaturaOut(BaseModel):
    codigo: str
    nombre: str
    creditos: int
    tipo: str
    class Config:
        from_attributes = True
