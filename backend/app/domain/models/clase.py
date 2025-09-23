"""SQLAlchemy model for Clase."""
import enum
from sqlalchemy import Integer, String, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class EstadoClase(enum.Enum):
    PROPUESTO = "PROPUESTO"
    ACTIVO = "ACTIVO"
    SUSPENDIDO = "SUSPENDIDO"

class Clase(Base):
    __tablename__ = "clase"
    clase_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    seccion_id: Mapped[str] = mapped_column(String, ForeignKey("seccion.seccion_id", ondelete="CASCADE"), nullable=False)
    docente_rut: Mapped[str] = mapped_column(String, ForeignKey("docente.docente_rut", ondelete="RESTRICT"), nullable=False)
    sala_codigo: Mapped[str] = mapped_column(String, ForeignKey("sala.codigo", ondelete="RESTRICT"), nullable=False)
    bloque_id: Mapped[int] = mapped_column(Integer, ForeignKey("bloque.bloque_id", ondelete="RESTRICT"), nullable=False)
    estado: Mapped[EstadoClase] = mapped_column(Enum(EstadoClase), nullable=False, default=EstadoClase.PROPUESTO)
    __table_args__ = (
        UniqueConstraint("docente_rut", "bloque_id", name="uq_docente_bloque"),
        UniqueConstraint("sala_codigo", "bloque_id", name="uq_sala_bloque"),
        UniqueConstraint("seccion_id", "bloque_id", name="uq_seccion_bloque"),
    )
