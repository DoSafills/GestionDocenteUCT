"""SQLAlchemy model for Docente."""
from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class Docente(Base):
    __tablename__ = "docente"
    docente_rut: Mapped[str] = mapped_column(String, primary_key=True)
    nombre: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    pass_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    max_horas_docencia: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
