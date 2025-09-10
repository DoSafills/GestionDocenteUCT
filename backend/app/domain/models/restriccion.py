"""SQLAlchemy model for Restriccion."""
import enum
from sqlalchemy import String, Float, Text, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class TipoRestriccion(enum.Enum):
    NoDisponible = "NoDisponible"
    Preferencia = "Preferencia"

class Restriccion(Base):
    __tablename__ = "restriccion"
    restriccion_id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True)
    docente_rut: Mapped[str] = mapped_column(String, ForeignKey("docente.docente_rut", ondelete="CASCADE"), nullable=False)
    tipo: Mapped[TipoRestriccion] = mapped_column(Enum(TipoRestriccion), nullable=False)
    operador: Mapped[str | None] = mapped_column(String, nullable=True)
    valor: Mapped[str] = mapped_column(Text, nullable=False)
    prioridad: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    comentario: Mapped[str | None] = mapped_column(Text, nullable=True)
