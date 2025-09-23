"""Pydantic schemas for Edificio."""
from pydantic import BaseModel

class EdificioIn(BaseModel):
    codigo: str
    numero: str
    nombre: str
    campus_codigo: str

class EdificioOut(BaseModel):
    codigo: str
    numero: str
    nombre: str
    campus_codigo: str
    class Config:
        from_attributes = True
