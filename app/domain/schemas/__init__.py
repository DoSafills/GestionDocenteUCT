"""
Schemas del dominio - Validación con Pydantic
"""

# Importar schemas base primero para evitar circular imports
from .docente import DocenteBase, DocenteCreate, DocenteUpdate, DocenteResponse, DocenteSchema
from .clase import ClaseBase, ClaseCreate, ClaseUpdate, ClaseResponse

# Importar otros schemas cuando estén implementados
# from .asignatura import AsignaturaBase, AsignaturaCreate, AsignaturaUpdate, AsignaturaResponse
# from .campus import CampusBase, CampusCreate, CampusUpdate, CampusResponse
# from .edificio import EdificioBase, EdificioCreate, EdificioUpdate, EdificioResponse

__all__ = [
    # Docente
    "DocenteBase",
    "DocenteCreate", 
    "DocenteUpdate",
    "DocenteResponse",
    "DocenteSchema",
    
    # Clase
    "ClaseBase",
    "ClaseCreate",
    "ClaseUpdate", 
    "ClaseResponse",
    
    # Otros (cuando estén implementados)
    # "AsignaturaBase",
    # "AsignaturaCreate",
    # "AsignaturaUpdate", 
    # "AsignaturaResponse",
]

# Resolver forward references después de que todos los schemas estén cargados
def resolve_forward_refs():
    """Resuelve las referencias forward después de cargar todos los schemas."""
    try:
        DocenteResponse.model_rebuild()
        ClaseResponse.model_rebuild()
    except Exception:
        # Si falla, los schemas seguirán funcionando con string literals
        pass

# Llamar al resolver al final
resolve_forward_refs()
