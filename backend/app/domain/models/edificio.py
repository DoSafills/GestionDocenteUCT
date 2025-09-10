"""SQLAlchemy model for Edificio."""
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class Edificio(Base):
    __tablename__ = "edificio"
    codigo: Mapped[str] = mapped_column(String, primary_key=True)
    numero: Mapped[str] = mapped_column(String, nullable=False)
    nombre: Mapped[str] = mapped_column(String, nullable=False)
    campus_codigo: Mapped[str] = mapped_column(String, ForeignKey("campus.codigo", ondelete="RESTRICT"), nullable=False)
