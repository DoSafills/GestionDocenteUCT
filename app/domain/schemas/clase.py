"""Esquema de Clase, para validacion de datos"""
from typing import List, Optional
from pydantic import BaseModel, Field

class ClaseBase(BaseModel):
    nombre: str = Field(..., max_length=100, example="Matemáticas I")
    codigo: str = Field(..., max_length=20, example="MAT101")
    descripcion: Optional[str] = Field(None, max_length=255)
    horas_semanales: int = Field(default=0, example=4)

class ClaseCreate(ClaseBase):
    pass

class ClaseUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = Field(None, max_length=255)
    horas_semanales: Optional[int] = None

class ClaseResponse(ClaseBase):
    clase_id: int
    # Usar una estructura simple sin referencia a DocenteBase por ahora
    docentes: List[dict] = []
    
    class Config:
        from_attributes = True