"""Pydantic schemas for Bloque."""
from pydantic import BaseModel, Field

class BloqueIn(BaseModel):
    bloque_id: int
    dia_semana: int = Field(ge=1, le=7)
    hora_inicio: str
    hora_fin: str

class BloqueOut(BaseModel):
    bloque_id: int
    dia_semana: int
    hora_inicio: str
    hora_fin: str
    class Config:
        from_attributes = True
