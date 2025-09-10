"""SQLAlchemy model for Asignatura."""
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class Asignatura(Base):
    __tablename__ = "asignatura"
    codigo: Mapped[str] = mapped_column(String, primary_key=True)
    nombre: Mapped[str] = mapped_column(String, nullable=False)
    creditos: Mapped[int] = mapped_column(Integer, nullable=False)
    tipo: Mapped[str] = mapped_column(String, nullable=False)
