"""SQLAlchemy model for Campus."""
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from ...config.database import Base

class Campus(Base):
    __tablename__ = "campus"
    codigo: Mapped[str] = mapped_column(String, primary_key=True)
    nombre: Mapped[str] = mapped_column(String, nullable=False)
