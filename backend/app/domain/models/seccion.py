"""SQLAlchemy model for Seccion."""
from sqlalchemy import Integer, String, UniqueConstraint, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class Seccion(Base):
    __tablename__ = "seccion"
    seccion_id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True)
    numero: Mapped[int] = mapped_column(Integer, nullable=False)
    codigo: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    anio: Mapped[int] = mapped_column(Integer, nullable=False)
    semestre: Mapped[int] = mapped_column(Integer, nullable=False)
    asignatura_codigo: Mapped[str] = mapped_column(String, ForeignKey("asignatura.codigo", ondelete="RESTRICT"), nullable=False)
    cupos: Mapped[int] = mapped_column(Integer, nullable=False)
    __table_args__ = (UniqueConstraint("asignatura_codigo", "anio", "semestre", "numero", name="uq_seccion_unica"),)
