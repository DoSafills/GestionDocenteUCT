"""
Servicio de aplicación para la gestión de docentes.
Orquesta las operaciones de alto nivel y aplica reglas de negocio.
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.domain.models.docente import Docente
from app.domain.schemas.docente import DocenteCreate, DocenteUpdate, DocenteResponse
from app.infrastructure.repositories.docente_repo import DocenteRepository
from app.domain.factories.docente_factory import DocenteFactory
from app.config.database import get_db_session


class DocenteService:
    """
    Servicio de aplicación para la gestión integral de docentes.
    Implementa casos de uso y reglas de negocio de alto nivel.
    """
    
    def __init__(self, db_session: Optional[Session] = None):
        """
        Inicializa el servicio con repositorio de docentes.
        
        Args:
            db_session: Sesión de base de datos opcional
        """
        self.db = db_session or get_db_session()
        self.docente_repo = DocenteRepository(self.db)
    
    def registrar_docente(self, docente_data: DocenteCreate) -> DocenteResponse:
        """
        Registra un nuevo docente en el sistema aplicando validaciones de negocio.
        
        Args:
            docente_data: Datos del docente a registrar
            
        Returns:
            Datos del docente registrado
            
        Raises:
            ValueError: Si los datos no cumplen las reglas de negocio
        """
        # Validar que no exista docente con mismo RUT
        if self.docente_repo.obtener_docente_por_rut(docente_data.docente_rut):
            raise ValueError(f"Ya existe un docente con RUT: {docente_data.docente_rut}")
        
        # Validar que no exista docente con mismo email
        if self.docente_repo.obtener_docente_por_email(docente_data.email):
            raise ValueError(f"Ya existe un docente con email: {docente_data.email}")
        
        # Validar horas mínimas usando factory
        categoria = DocenteFactory.obtener_categoria_docente(docente_data.max_horas_docencia)
        
        # Crear docente
        nuevo_docente = self.docente_repo.crear_docente(docente_data)
        
        return DocenteResponse.model_validate(nuevo_docente)
    
    def obtener_docente(self, docente_rut: str) -> Optional[DocenteResponse]:
        """
        Obtiene un docente por su RUT.
        
        Args:
            docente_rut: RUT del docente
            
        Returns:
            Datos del docente o None si no existe
        """
        docente = self.docente_repo.obtener_docente_por_rut(docente_rut)
        if not docente:
            return None
        
        return DocenteResponse.model_validate(docente)
    
    def listar_docentes(self, skip: int = 0, limit: int = 100) -> List[DocenteResponse]:
        """
        Lista todos los docentes con paginación.
        
        Args:
            skip: Registros a omitir
            limit: Máximo de registros a retornar
            
        Returns:
            Lista de docentes
        """
        docentes = self.docente_repo.listar_docentes(skip, limit)
        return [DocenteResponse.model_validate(docente) for docente in docentes]
    
    def buscar_docentes(self, termino_busqueda: str) -> List[DocenteResponse]:
        """
        Busca docentes por nombre.
        
        Args:
            termino_busqueda: Término a buscar en el nombre
            
        Returns:
            Lista de docentes que coinciden
        """
        docentes = self.docente_repo.buscar_docentes_por_nombre(termino_busqueda)
        return [DocenteResponse.model_validate(docente) for docente in docentes]
    
    def actualizar_docente(self, docente_rut: str, datos_actualizacion: DocenteUpdate) -> Optional[DocenteResponse]:
        """
        Actualiza los datos de un docente existente.
        
        Args:
            docente_rut: RUT del docente a actualizar
            datos_actualizacion: Nuevos datos del docente
            
        Returns:
            Datos del docente actualizado o None si no existe
        """
        # Validar email único si se está actualizando
        if datos_actualizacion.email:
            docente_existente = self.docente_repo.obtener_docente_por_email(datos_actualizacion.email)
            if docente_existente and docente_existente.docente_rut != docente_rut:
                raise ValueError(f"Ya existe un docente con email: {datos_actualizacion.email}")
        
        docente_actualizado = self.docente_repo.actualizar_docente(docente_rut, datos_actualizacion)
        if not docente_actualizado:
            return None
        
        return DocenteResponse.model_validate(docente_actualizado)
    
    def eliminar_docente(self, docente_rut: str) -> bool:
        """
        Elimina un docente del sistema.
        
        Args:
            docente_rut: RUT del docente a eliminar
            
        Returns:
            True si fue eliminado, False si no existe
        """
        # Verificar si tiene clases asignadas
        docente = self.docente_repo.obtener_docente_por_rut(docente_rut)
        if not docente:
            return False
        
        if docente.clases:
            raise ValueError("No se puede eliminar un docente que tiene clases asignadas")
        
        return self.docente_repo.eliminar_docente(docente_rut)
    
    def obtener_estadisticas_docente(self, docente_rut: str) -> Dict[str, Any]:
        """
        Obtiene estadísticas de un docente específico.
        
        Args:
            docente_rut: RUT del docente
            
        Returns:
            Diccionario con estadísticas del docente
        """
        docente = self.docente_repo.obtener_docente_por_rut(docente_rut)
        if not docente:
            raise ValueError(f"No existe docente con RUT: {docente_rut}")
        
        total_clases = len(docente.clases)
        categoria = DocenteFactory.obtener_categoria_docente(docente.max_horas_docencia)
        
        # Calcular horas asignadas (ejemplo básico)
        horas_asignadas = total_clases * 2  # Asumiendo 2 horas por clase
        horas_disponibles = max(0, docente.max_horas_docencia - horas_asignadas)
        
        return {
            "docente_rut": docente.docente_rut,
            "nombre": docente.nombre,
            "categoria": categoria,
            "max_horas_docencia": docente.max_horas_docencia,
            "horas_asignadas": horas_asignadas,
            "horas_disponibles": horas_disponibles,
            "total_clases": total_clases,
            "porcentaje_ocupacion": (horas_asignadas / docente.max_horas_docencia) * 100 if docente.max_horas_docencia > 0 else 0
        }
    
    def obtener_docentes_disponibles(self, horas_requeridas: int = 2) -> List[DocenteResponse]:
        """
        Obtiene docentes que tienen horas disponibles para nuevas asignaciones.
        
        Args:
            horas_requeridas: Horas mínimas disponibles requeridas
            
        Returns:
            Lista de docentes disponibles
        """
        todos_docentes = self.docente_repo.listar_docentes()
        docentes_disponibles = []
        
        for docente in todos_docentes:
            estadisticas = self.obtener_estadisticas_docente(docente.docente_rut)
            if estadisticas["horas_disponibles"] >= horas_requeridas:
                docentes_disponibles.append(docente)
        
        return [DocenteResponse.model_validate(docente) for docente in docentes_disponibles]
    
    def asignar_clase(self, docente_rut: str, clase_id: int) -> bool:
        """
        Asigna una clase a un docente verificando disponibilidad de horas.
        
        Args:
            docente_rut: RUT del docente
            clase_id: ID de la clase a asignar
            
        Returns:
            True si la asignación fue exitosa
        """
        # Verificar disponibilidad de horas
        estadisticas = self.obtener_estadisticas_docente(docente_rut)
        if estadisticas["horas_disponibles"] < 2:  # Asumiendo 2 horas por clase
            raise ValueError("El docente no tiene horas disponibles suficientes")
        
        return self.docente_repo.asignar_clase_a_docente(docente_rut, clase_id)
    
    def desasignar_clase(self, docente_rut: str, clase_id: int) -> bool:
        """
        Desasigna una clase de un docente.
        
        Args:
            docente_rut: RUT del docente
            clase_id: ID de la clase a desasignar
            
        Returns:
            True si la desasignación fue exitosa
        """
        return self.docente_repo.desasignar_clase_de_docente(docente_rut, clase_id)
    
    def obtener_resumen_sistema(self) -> Dict[str, Any]:
        """
        Obtiene un resumen del estado del sistema de docentes.
        
        Returns:
            Diccionario con estadísticas generales
        """
        total_docentes = self.docente_repo.contar_docentes()
        todos_docentes = self.docente_repo.listar_docentes(limit=total_docentes)
        
        por_categoria = {"Jornada Completa": 0, "Media Jornada": 0, "Jornada Parcial": 0}
        total_horas_sistema = 0
        total_horas_asignadas = 0
        
        for docente in todos_docentes:
            categoria = DocenteFactory.obtener_categoria_docente(docente.max_horas_docencia)
            por_categoria[categoria] += 1
            total_horas_sistema += docente.max_horas_docencia
            total_horas_asignadas += len(docente.clases) * 2  # 2 horas por clase
        
        return {
            "total_docentes": total_docentes,
            "distribucion_por_categoria": por_categoria,
            "total_horas_sistema": total_horas_sistema,
            "total_horas_asignadas": total_horas_asignadas,
            "horas_disponibles": total_horas_sistema - total_horas_asignadas,
            "porcentaje_ocupacion_sistema": (total_horas_asignadas / total_horas_sistema) * 100 if total_horas_sistema > 0 else 0
        }
    
    def close(self):
        """Cierra las conexiones del servicio."""
        self.docente_repo.close()
