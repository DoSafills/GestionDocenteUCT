"""SQLAlchemy model for ReporteDetalleHoras."""
from sqlalchemy import String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class ReporteDetalleHoras(Base):
    __tablename__ = "reporte_detalle_horas"
    reporte_id: Mapped[str] = mapped_column(String, ForeignKey("reporte.reporte_id", ondelete="CASCADE"), primary_key=True)
    docente_rut: Mapped[str] = mapped_column(String, ForeignKey("docente.docente_rut", ondelete="CASCADE"), primary_key=True)
    horas_asignadas: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    max_horas: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    exceso: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    estado: Mapped[str] = mapped_column(String, nullable=False, default="OK")
