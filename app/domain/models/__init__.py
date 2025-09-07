"""
Modelos del dominio - Entidades ORM
"""

# Importar todos los modelos para que SQLAlchemy los reconozca
#from .campus import Campus
#from .edificio import Edificio
#from .asignatura import Asignatura
from .docente import Docente
from .clase import Clase

# Importar cuando estén implementados
# from .sala import Sala
# from .seccion import Seccion
# from .bloque import Bloque
# from .restriccion import Restriccion
# from .reporte import Reporte
# from .reporteHoras import ReporteHoras

__all__ = [
    #"Campus",
    #"Edificio", 
    #"Asignatura",
    "Docente",
    "Clase",
    # "Sala",
    # "Seccion",
    # "Bloque",
    # "Restriccion",
    # "Reporte",
    # "ReporteHoras",
]
