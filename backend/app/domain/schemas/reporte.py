"""Pydantic schemas for Reporte."""
from pydantic import BaseModel

class ReporteIn(BaseModel):
    reporte_id: str
    tipo: str
    generado_en: str
    generado_por: str | None = None
    comentario: str | None = None

class ReporteOut(BaseModel):
    reporte_id: str
    tipo: str
    generado_en: str
    generado_por: str | None
    comentario: str | None
    class Config:
        from_attributes = True
