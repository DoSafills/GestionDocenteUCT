''' Modelo ORM de Clase '''

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base
from app.domain.models.docente import Docente

class Clase(Base):
    __tablename__ = "clases"
    clase_id = Column(Integer, primary_key=True, index=True)
    seccion_id = Column(UUID, unique=True, index=True)
    docente_rut = Column(String, ForeignKey('docentes.docente_rut'))
    sala_codigo = Column(String(20), nullable=False)
    bloque_id = Column(Integer, nullable=False)
    estado = Column(String(20), nullable=False)

    # Relación Many-to-Many con Docentes
    docentes = relationship("Docente", secondary='docente_clase', back_populates="clases")