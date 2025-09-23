"""SQLAlchemy model for Bloque."""
from sqlalchemy import Integer, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class Bloque(Base):
    __tablename__ = "bloque"
    bloque_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    dia_semana: Mapped[int] = mapped_column(Integer, nullable=False)
    hora_inicio: Mapped["time"] = mapped_column(Time, nullable=False)
    hora_fin: Mapped["time"] = mapped_column(Time, nullable=False)
    __table_args__ = (UniqueConstraint("dia_semana", "hora_inicio", "hora_fin", name="uq_bloque_horario"),)
