"""Modelo ORM de Docente"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from Backend.config.database import Base

class Docente(Base):
    __tablename__ = "docente"

    docente_rut = Column(String, primary_key=True, index=True)
    nombre = Column(String(70), index=True)
    email = Column(String(100), unique=True, index=True)
    pass_hash = Column(String(128))
    max_horas_docencia = Column(Integer)
    
    # Relación One-to-Many con Clases (un docente puede tener muchas clases)
    clases = relationship("Clase", back_populates="docente", cascade="all, delete-orphan")