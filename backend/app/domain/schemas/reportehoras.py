"""Pydantic schemas for ReporteDetalleHoras."""
from pydantic import BaseModel, Field

class ReporteDetalleHorasIn(BaseModel):
    reporte_id: str
    docente_rut: str
    horas_asignadas: float = Field(ge=0)
    max_horas: float = Field(ge=0)
    exceso: float = Field(ge=0)
    estado: str

class ReporteDetalleHorasOut(BaseModel):
    reporte_id: str
    docente_rut: str
    horas_asignadas: float
    max_horas: float
    exceso: float
    estado: str
    class Config:
        from_attributes = True
