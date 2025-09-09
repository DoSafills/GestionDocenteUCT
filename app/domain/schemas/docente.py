"""Esquema de Docente, para validacion de datos"""
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class DocenteBase(BaseModel):
    docente_rut: str = Field(..., max_length=12, min_length=8)
    nombre: str = Field(..., max_length=70)
    email: EmailStr = Field(..., max_length=100)
    max_horas_docencia: int = Field(...)

class DocenteCreate(DocenteBase):
    pass_hash: str = Field(..., max_length=128)

class DocenteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=70)
    email: Optional[EmailStr] = Field(None, max_length=100)
    max_horas_docencia: Optional[int] = None

class DocenteResponse(DocenteBase):
    # Usar una estructura simple sin referencia a ClaseBase por ahora
    clases: List[dict] = []

    model_config = ConfigDict(from_attributes=True)

class DocenteSchema(DocenteBase):
    """Schema principal para compatibilidad"""
    pass_hash: str = Field(..., max_length=128)