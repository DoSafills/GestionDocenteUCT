"""Pydantic schemas for Docente."""
from pydantic import BaseModel, EmailStr, Field

class DocenteIn(BaseModel):
    docente_rut: str = Field(..., min_length=3)
    nombre: str
    email: EmailStr
    max_horas_docencia: int = Field(ge=0)
    pass_hash: str | None = None

class DocenteOut(BaseModel):
    docente_rut: str
    nombre: str
    email: EmailStr
    max_horas_docencia: int
    class Config:
        from_attributes = True
