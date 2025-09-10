"""Pydantic schemas for Campus."""
from pydantic import BaseModel

class CampusIn(BaseModel):
    codigo: str
    nombre: str

class CampusOut(BaseModel):
    codigo: str
    nombre: str
    class Config:
        from_attributes = True
