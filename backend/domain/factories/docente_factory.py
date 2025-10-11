"""
Factory Method para la creación de docentes con validaciones PostgreSQL.
"""
from Backend.domain.models.docente import Docente
from Backend.domain.schemas.docente import DocenteCreate


class DocenteFactory:
    """
    Factory para la creación de docentes con validaciones de horas mínimas.
    Adaptado para PostgreSQL y el modelo de datos actual.
    """
    
    # Configuración de horas por categoría
    HORAS_MINIMAS_JORNADA_COMPLETA = 40
    HORAS_MINIMAS_MEDIA_JORNADA = 20
    HORAS_MINIMAS_PARCIAL = 4
    HORAS_MAXIMAS_PERMITIDAS = 44
    
    @staticmethod
    def crear_docente(datos: DocenteCreate) -> Docente:
        """
        Crea un docente con validaciones de negocio.
        
        Args:
            datos: Datos del docente a crear
            
        Returns:
            Instancia de Docente validada
            
        Raises:
            ValueError: Si los datos no cumplen las validaciones
        """
        # Validaciones básicas
        DocenteFactory._validar_datos_basicos(datos)
        
        # Validar horas de trabajo
        horas_validadas = DocenteFactory._validar_horas_trabajo(datos.max_horas_docencia)
        
        # Crear docente con datos validados
        return Docente(
            docente_rut=datos.docente_rut.upper().strip(),
            nombre=datos.nombre.strip(),
            email=datos.email.lower().strip(),
            pass_hash=datos.pass_hash,
            max_horas_docencia=horas_validadas
        )
    
    @staticmethod
    def _validar_datos_basicos(datos: DocenteCreate) -> None:
        """Validaciones básicas para todos los docentes."""
        if not datos.nombre or len(datos.nombre.strip()) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres")
        
        if not datos.email or "@" not in datos.email:
            raise ValueError("Email no válido")
            
        if not datos.docente_rut or len(datos.docente_rut.strip()) < 8:
            raise ValueError("RUT no válido")
            
        if not datos.max_horas_docencia:
            raise ValueError("Las horas de docencia son obligatorias")
    
    @staticmethod
    def _validar_horas_trabajo(horas: int) -> int:
        """
        Valida las horas de trabajo del docente.
        
        Args:
            horas: Horas máximas propuestas
            
        Returns:
            Horas validadas
            
        Raises:
            ValueError: Si las horas no están en el rango permitido
        """
        if horas < DocenteFactory.HORAS_MINIMAS_PARCIAL:
            raise ValueError(f"Las horas mínimas deben ser al menos {DocenteFactory.HORAS_MINIMAS_PARCIAL}")
        
        if horas > DocenteFactory.HORAS_MAXIMAS_PERMITIDAS:
            raise ValueError(f"Las horas no pueden exceder {DocenteFactory.HORAS_MAXIMAS_PERMITIDAS}")
        
        return horas
    
    @staticmethod
    def obtener_categoria_docente(horas: int) -> str:
        """
        Determina la categoría del docente basada en sus horas máximas.
        
        Args:
            horas: Horas máximas del docente
            
        Returns:
            Categoría del docente
        """
        if horas >= DocenteFactory.HORAS_MINIMAS_JORNADA_COMPLETA:
            return "Jornada Completa"
        elif horas >= DocenteFactory.HORAS_MINIMAS_MEDIA_JORNADA:
            return "Media Jornada"
        else:
            return "Jornada Parcial"
    
    @staticmethod
    def validar_disponibilidad_horas(docente: Docente, horas_requeridas: int) -> bool:
        """
        Valida si un docente tiene horas disponibles.
        
        Args:
            docente: Instancia del docente
            horas_requeridas: Horas que se requieren asignar
            
        Returns:
            True si tiene horas disponibles
        """
        # Calcular horas actualmente asignadas (simplificado)
        horas_asignadas = len(docente.clases) * 2  # Asumiendo 2 horas por clase
        horas_disponibles = docente.max_horas_docencia - horas_asignadas
        
        return horas_disponibles >= horas_requeridas

