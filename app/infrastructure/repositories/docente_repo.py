"""
Repositorio para la entidad Docente.
Maneja todas las operaciones de persistencia relacionadas con docentes.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.domain.models.docente import Docente
from app.domain.schemas.docente import DocenteCreate, DocenteUpdate
from app.config.database import get_db_session


class DocenteRepository:
    """
    Repositorio para la gestión de docentes en la base de datos.
    Encapsula todas las operaciones CRUD para la entidad Docente.
    """
    
    def __init__(self, db_session: Optional[Session] = None):
        """
        Inicializa el repositorio con una sesión de base de datos.
        
        Args:
            db_session: Sesión de SQLAlchemy. Si no se proporciona, se crea una nueva.
        """
        self.db = db_session or get_db_session()
    
    def crear_docente(self, docente_data: DocenteCreate) -> Docente:
        """
        Crea un nuevo docente en la base de datos.
        
        Args:
            docente_data: Datos del docente a crear
            
        Returns:
            Instancia del docente creado
            
        Raises:
            IntegrityError: Si hay violación de restricciones (RUT o email duplicados)
            ValueError: Si los datos son inválidos
        """
        try:
            nuevo_docente = Docente(
                docente_rut=docente_data.docente_rut,
                nombre=docente_data.nombre,
                email=docente_data.email,
                pass_hash=docente_data.pass_hash,
                max_horas_docencia=docente_data.max_horas_docencia
            )
            
            self.db.add(nuevo_docente)
            self.db.commit()
            self.db.refresh(nuevo_docente)
            
            return nuevo_docente
            
        except IntegrityError as e:
            self.db.rollback()
            if "docente_rut" in str(e):
                raise ValueError(f"Ya existe un docente con RUT: {docente_data.docente_rut}")
            elif "email" in str(e):
                raise ValueError(f"Ya existe un docente con email: {docente_data.email}")
            else:
                raise ValueError("Error de integridad en los datos del docente")
    
    def obtener_docente_por_rut(self, docente_rut: str) -> Optional[Docente]:
        """
        Obtiene un docente por su RUT.
        
        Args:
            docente_rut: RUT del docente a buscar
            
        Returns:
            Instancia del docente o None si no se encuentra
        """
        return self.db.query(Docente).filter(Docente.docente_rut == docente_rut).first()
    
    def obtener_docente_por_email(self, email: str) -> Optional[Docente]:
        """
        Obtiene un docente por su email.
        
        Args:
            email: Email del docente a buscar
            
        Returns:
            Instancia del docente o None si no se encuentra
        """
        return self.db.query(Docente).filter(Docente.email == email).first()
    
    def listar_docentes(self, skip: int = 0, limit: int = 100) -> List[Docente]:
        """
        Lista todos los docentes con paginación.
        
        Args:
            skip: Número de registros a omitir (para paginación)
            limit: Número máximo de registros a retornar
            
        Returns:
            Lista de docentes
        """
        return self.db.query(Docente).offset(skip).limit(limit).all()
    
    def buscar_docentes_por_nombre(self, nombre: str) -> List[Docente]:
        """
        Busca docentes por coincidencia parcial en el nombre.
        
        Args:
            nombre: Término de búsqueda en el nombre
            
        Returns:
            Lista de docentes que coinciden con la búsqueda
        """
        return self.db.query(Docente).filter(
            Docente.nombre.ilike(f"%{nombre}%")
        ).all()
    
    def actualizar_docente(self, docente_rut: str, docente_data: DocenteUpdate) -> Optional[Docente]:
        """
        Actualiza los datos de un docente existente.
        
        Args:
            docente_rut: RUT del docente a actualizar
            docente_data: Nuevos datos del docente
            
        Returns:
            Instancia del docente actualizado o None si no se encuentra
            
        Raises:
            IntegrityError: Si hay violación de restricciones
        """
        try:
            docente = self.obtener_docente_por_rut(docente_rut)
            if not docente:
                return None
            
            # Actualizar solo los campos proporcionados
            update_data = docente_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(docente, field, value)
            
            self.db.commit()
            self.db.refresh(docente)
            
            return docente
            
        except IntegrityError as e:
            self.db.rollback()
            if "email" in str(e):
                raise ValueError(f"Ya existe un docente con email: {docente_data.email}")
            else:
                raise ValueError("Error de integridad al actualizar el docente")
    
    def eliminar_docente(self, docente_rut: str) -> bool:
        """
        Elimina un docente de la base de datos.
        
        Args:
            docente_rut: RUT del docente a eliminar
            
        Returns:
            True si el docente fue eliminado, False si no se encontró
        """
        docente = self.obtener_docente_por_rut(docente_rut)
        if not docente:
            return False
        
        self.db.delete(docente)
        self.db.commit()
        return True
    
    def contar_docentes(self) -> int:
        """
        Cuenta el número total de docentes en la base de datos.
        
        Returns:
            Número total de docentes
        """
        return self.db.query(Docente).count()
    
    def obtener_docentes_con_horas_disponibles(self, horas_minimas: int = 1) -> List[Docente]:
        """
        Obtiene docentes que tienen horas disponibles para asignar.
        
        Args:
            horas_minimas: Mínimo de horas disponibles requeridas
            
        Returns:
            Lista de docentes con horas disponibles
        """
        # Esta consulta requiere calcular las horas asignadas vs las máximas
        # Por simplicidad, retornamos todos y filtraremos en el servicio
        return self.db.query(Docente).all()
    
    def asignar_clase_a_docente(self, docente_rut: str, clase_id: int) -> bool:
        """
        Asigna una clase a un docente actualizando la foreign key.
        
        Args:
            docente_rut: RUT del docente
            clase_id: ID de la clase a asignar
            
        Returns:
            True si la asignación fue exitosa, False si no se pudo realizar
        """
        from app.domain.models.clase import Clase
        
        # Verificar que el docente existe
        docente = self.obtener_docente_por_rut(docente_rut)
        if not docente:
            return False
        
        # Obtener la clase y verificar que existe
        clase = self.db.query(Clase).filter(Clase.clase_id == clase_id).first()
        if not clase:
            return False
        
        # Verificar que la clase no esté ya asignada a otro docente
        if clase.docente_rut is not None:
            return False
        
        # Asignar la clase al docente
        clase.docente_rut = docente_rut
        self.db.commit()
        return True
    
    def desasignar_clase_de_docente(self, docente_rut: str, clase_id: int) -> bool:
        """
        Desasigna una clase de un docente estableciendo la foreign key en NULL.
        
        Args:
            docente_rut: RUT del docente
            clase_id: ID de la clase a desasignar
            
        Returns:
            True si la desasignación fue exitosa, False si no se pudo realizar
        """
        from app.domain.models.clase import Clase
        
        # Obtener la clase
        clase = self.db.query(Clase).filter(Clase.clase_id == clase_id).first()
        if not clase:
            return False
        
        # Verificar que la clase esté asignada al docente especificado
        if clase.docente_rut != docente_rut:
            return False
        
        # Desasignar la clase
        clase.docente_rut = None
        self.db.commit()
        return True
    
    def obtener_clases_asignadas(self, docente_rut: str) -> List:
        """
        Obtiene todas las clases asignadas a un docente.
        
        Args:
            docente_rut: RUT del docente
            
        Returns:
            Lista de clases asignadas al docente
        """
        from app.domain.models.clase import Clase
        
        return self.db.query(Clase).filter(Clase.docente_rut == docente_rut).all()
    
    def contar_clases_asignadas(self, docente_rut: str) -> int:
        """
        Cuenta el número de clases asignadas a un docente.
        
        Args:
            docente_rut: RUT del docente
            
        Returns:
            Número de clases asignadas
        """
        from app.domain.models.clase import Clase
        
        return self.db.query(Clase).filter(Clase.docente_rut == docente_rut).count()
    
    def close(self):
        """Cierra la sesión de base de datos."""
        if self.db:
            self.db.close()