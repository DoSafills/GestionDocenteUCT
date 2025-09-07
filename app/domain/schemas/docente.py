"""Esquema de Docente, para validacion de datos"""
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from clase import ClaseBase 

class DocenteBase(BaseModel):
    docente_rut: str = Field(..., max_length=12, min_length=8, example="12345678-9")
    nombre: str = Field(..., max_length=70, example="Juan Perez")
    email: EmailStr = Field(..., max_length=100, example="juan.perez@example.com")
    max_horas_docencia: int = Field(..., example=40)

class DocenteCreate(DocenteBase):
    pass_hash: str = Field(..., max_length=128, example="hashed_password")

class DocenteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=70)
    email: Optional[EmailStr] = Field(None, max_length=100)
    max_horas_docencia: Optional[int] = None

class DocenteResponse(DocenteBase):
    clases: List["ClaseBase"] = []

    class Config:
        from_attributes = True

class DocenteSchema(DocenteBase):
    """Schema principal para compatibilidad"""
    pass_hash: str = Field(..., max_length=128, example="hashed_password")