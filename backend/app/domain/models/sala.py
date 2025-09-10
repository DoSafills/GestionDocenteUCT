"""SQLAlchemy model for Sala."""
import enum
from sqlalchemy import String, Integer, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class TipoSala(enum.Enum):
    AULA = "AULA"
    LAB = "LAB"
    TALLER = "TALLER"
    AUDITORIO = "AUDITORIO"

class EstadoSala(enum.Enum):
    DISPONIBLE = "DISPONIBLE"
    NO_DISPONIBLE = "NO_DISPONIBLE"

class Sala(Base):
    __tablename__ = "sala"
    codigo: Mapped[str] = mapped_column(String, primary_key=True)
    numero: Mapped[str] = mapped_column(String, nullable=False)
    capacidad: Mapped[int] = mapped_column(Integer, nullable=False)
    tipo: Mapped[TipoSala] = mapped_column(Enum(TipoSala), nullable=False)
    piso: Mapped[str | None] = mapped_column(String, nullable=True)
    estado: Mapped[EstadoSala] = mapped_column(Enum(EstadoSala), nullable=False, default=EstadoSala.DISPONIBLE)
    edificio_codigo: Mapped[str] = mapped_column(String, ForeignKey("edificio.codigo", ondelete="RESTRICT"), nullable=False)
