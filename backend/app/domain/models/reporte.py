"""SQLAlchemy model for Reporte."""
import enum
from sqlalchemy import String, Enum, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class TipoReporte(enum.Enum):
    HORAS_DOCENTE = "HORAS_DOCENTE"
    CONFLICTOS = "CONFLICTOS"

class Reporte(Base):
    __tablename__ = "reporte"
    reporte_id: Mapped[str] = mapped_column(String, primary_key=True)
    tipo: Mapped[TipoReporte] = mapped_column(Enum(TipoReporte), nullable=False)
    generado_en: Mapped["datetime"] = mapped_column(DateTime, nullable=False)
    generado_por: Mapped[str] = mapped_column(String, nullable=True)
    comentario: Mapped[str | None] = mapped_column(Text, nullable=True)
