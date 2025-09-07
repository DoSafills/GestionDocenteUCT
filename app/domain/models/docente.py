"""Modelo ORM de Docente"""
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base

# Tabla intermedia para la relación Many-to-Many
docente_clase = Table(
    'docente_clase',
    Base.metadata,
    Column('docente_rut', String, ForeignKey('docentes.docente_rut'), primary_key=True),
    Column('clase_id', Integer, ForeignKey('clases.clase_id'), primary_key=True)
)

class Docente(Base):
    __tablename__ = "docentes"

    docente_rut = Column(String, primary_key=True, index=True)
    nombre = Column(String(70), index=True)
    email = Column(String(100), unique=True, index=True)
    pass_hash = Column(String(128))
    max_horas_docencia = Column(Integer)
    
    # Relación Many-to-Many con Clases
    clases = relationship("Clase", secondary=docente_clase, back_populates="docentes")