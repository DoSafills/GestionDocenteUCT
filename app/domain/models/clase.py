""" Modelo ORM de Clase """

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base

class Clase(Base):
    __tablename__ = "clases"
    
    clase_id = Column(Integer, primary_key=True, index=True)
    seccion_id = Column(UUID, unique=True, index=True)
    docente_rut = Column(String, ForeignKey('docentes.docente_rut'), nullable=True, index=True)
    sala_codigo = Column(String(20), nullable=False)
    bloque_id = Column(Integer, nullable=False)
    estado = Column(String(20), nullable=False)

    # Relación Many-to-One con Docente (muchas clases pueden pertenecer a un docente)
    docente = relationship("Docente", back_populates="clases")