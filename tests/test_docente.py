"""
Tests de integración para el módulo de docentes.
Cubre el flujo completo desde service hasta repository.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config.database import Base
from app.domain.models.docente import Docente
from app.domain.schemas.docente import DocenteCreate, DocenteUpdate
from app.domain.factories.docente_factory import DocenteFactory
from app.infrastructure.repositories.docente_repo import DocenteRepository
from app.application.services.docente_service import DocenteService


@pytest.fixture
def db_session():
    """Fixture para crear una sesión de base de datos en memoria para tests."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    yield session
    
    session.close()


@pytest.fixture
def docente_data():
    """Fixture con datos de docente válidos para tests."""
    return DocenteCreate(
        docente_rut="12345678-9",
        nombre="Juan Pérez",
        email="juan.perez@uct.cl",
        pass_hash="hashed_password_123",
        max_horas_docencia=40
    )


@pytest.fixture
def docente_repo(db_session):
    """Fixture para repositorio de docentes."""
    return DocenteRepository(db_session)


@pytest.fixture
def docente_service(db_session):
    """Fixture para servicio de docentes."""
    return DocenteService(db_session)


class TestDocenteFactory:
    """Tests unitarios para DocenteFactory."""
    
    def test_obtener_categoria_jornada_completa(self):
        """Test categorización de docente jornada completa."""
        categoria = DocenteFactory.obtener_categoria_docente(40)
        assert categoria == "Jornada Completa"
        
        categoria = DocenteFactory.obtener_categoria_docente(44)
        assert categoria == "Jornada Completa"
    
    def test_obtener_categoria_media_jornada(self):
        """Test categorización de docente media jornada."""
        categoria = DocenteFactory.obtener_categoria_docente(20)
        assert categoria == "Media Jornada"
        
        categoria = DocenteFactory.obtener_categoria_docente(35)
        assert categoria == "Media Jornada"
    
    def test_obtener_categoria_jornada_parcial(self):
        """Test categorización de docente jornada parcial."""
        categoria = DocenteFactory.obtener_categoria_docente(4)
        assert categoria == "Jornada Parcial"
        
        categoria = DocenteFactory.obtener_categoria_docente(15)
        assert categoria == "Jornada Parcial"


class TestDocenteRepository:
    """Tests unitarios para DocenteRepository."""
    
    def test_crear_docente_exitoso(self, docente_repo, docente_data):
        """Test creación exitosa de docente."""
        docente = docente_repo.crear_docente(docente_data)
        
        assert docente.docente_rut == "12345678-9"
        assert docente.nombre == "Juan Pérez"
        assert docente.email == "juan.perez@uct.cl"
        assert docente.max_horas_docencia == 40
    
    def test_crear_docente_rut_duplicado(self, docente_repo, docente_data):
        """Test error al crear docente con RUT duplicado."""
        docente_repo.crear_docente(docente_data)
        
        with pytest.raises(ValueError, match="Ya existe un docente con RUT"):
            docente_repo.crear_docente(docente_data)
    
    def test_obtener_docente_por_rut_existente(self, docente_repo, docente_data):
        """Test obtener docente existente por RUT."""
        docente_creado = docente_repo.crear_docente(docente_data)
        docente_obtenido = docente_repo.obtener_docente_por_rut("12345678-9")
        
        assert docente_obtenido is not None
        assert docente_obtenido.docente_rut == docente_creado.docente_rut
    
    def test_obtener_docente_por_rut_inexistente(self, docente_repo):
        """Test obtener docente inexistente por RUT."""
        docente = docente_repo.obtener_docente_por_rut("99999999-9")
        assert docente is None
    
    def test_obtener_docente_por_email(self, docente_repo, docente_data):
        """Test obtener docente por email."""
        docente_repo.crear_docente(docente_data)
        docente = docente_repo.obtener_docente_por_email("juan.perez@uct.cl")
        
        assert docente is not None
        assert docente.email == "juan.perez@uct.cl"
    
    def test_listar_docentes_vacio(self, docente_repo):
        """Test listar docentes cuando no hay ninguno."""
        docentes = docente_repo.listar_docentes()
        assert len(docentes) == 0
    
    def test_listar_docentes_con_datos(self, docente_repo, docente_data):
        """Test listar docentes con datos."""
        docente_repo.crear_docente(docente_data)
        
        # Crear segundo docente
        docente_data2 = DocenteCreate(
            docente_rut="98765432-1",
            nombre="María González",
            email="maria.gonzalez@uct.cl",
            pass_hash="hashed_password_456",
            max_horas_docencia=20
        )
        docente_repo.crear_docente(docente_data2)
        
        docentes = docente_repo.listar_docentes()
        assert len(docentes) == 2
    
    def test_buscar_docentes_por_nombre(self, docente_repo, docente_data):
        """Test búsqueda de docentes por nombre."""
        docente_repo.crear_docente(docente_data)
        
        docentes = docente_repo.buscar_docentes_por_nombre("Juan")
        assert len(docentes) == 1
        assert docentes[0].nombre == "Juan Pérez"
        
        docentes = docente_repo.buscar_docentes_por_nombre("María")
        assert len(docentes) == 0
    
    def test_actualizar_docente_existente(self, docente_repo, docente_data):
        """Test actualización de docente existente."""
        docente_repo.crear_docente(docente_data)
        
        datos_actualizacion = DocenteUpdate(
            nombre="Juan Carlos Pérez",
            max_horas_docencia=44
        )
        
        docente_actualizado = docente_repo.actualizar_docente(
            "12345678-9", datos_actualizacion
        )
        
        assert docente_actualizado is not None
        assert docente_actualizado.nombre == "Juan Carlos Pérez"
        assert docente_actualizado.max_horas_docencia == 44
    
    def test_actualizar_docente_inexistente(self, docente_repo):
        """Test actualización de docente inexistente."""
        datos_actualizacion = DocenteUpdate(nombre="Nuevo Nombre")
        
        resultado = docente_repo.actualizar_docente(
            "99999999-9", datos_actualizacion
        )
        
        assert resultado is None
    
    def test_eliminar_docente_existente(self, docente_repo, docente_data):
        """Test eliminación de docente existente."""
        docente_repo.crear_docente(docente_data)
        
        resultado = docente_repo.eliminar_docente("12345678-9")
        assert resultado is True
        
        # Verificar que fue eliminado
        docente = docente_repo.obtener_docente_por_rut("12345678-9")
        assert docente is None
    
    def test_eliminar_docente_inexistente(self, docente_repo):
        """Test eliminación de docente inexistente."""
        resultado = docente_repo.eliminar_docente("99999999-9")
        assert resultado is False
    
    def test_contar_docentes(self, docente_repo, docente_data):
        """Test conteo de docentes."""
        assert docente_repo.contar_docentes() == 0
        
        docente_repo.crear_docente(docente_data)
        assert docente_repo.contar_docentes() == 1


class TestDocenteService:
    """Tests unitarios para DocenteService."""
    
    def test_registrar_docente_exitoso(self, docente_service, docente_data):
        """Test registro exitoso de docente."""
        docente_response = docente_service.registrar_docente(docente_data)
        
        assert docente_response.docente_rut == "12345678-9"
        assert docente_response.nombre == "Juan Pérez"
        assert docente_response.email == "juan.perez@uct.cl"
        assert docente_response.max_horas_docencia == 40
    
    def test_registrar_docente_rut_duplicado(self, docente_service, docente_data):
        """Test error al registrar docente con RUT duplicado."""
        docente_service.registrar_docente(docente_data)
        
        with pytest.raises(ValueError, match="Ya existe un docente con RUT"):
            docente_service.registrar_docente(docente_data)
    
    def test_registrar_docente_email_duplicado(self, docente_service, docente_data):
        """Test error al registrar docente con email duplicado."""
        docente_service.registrar_docente(docente_data)
        
        docente_data2 = DocenteCreate(
            docente_rut="98765432-1",
            nombre="María González",
            email="juan.perez@uct.cl",  # Email duplicado
            pass_hash="hashed_password_456",
            max_horas_docencia=20
        )
        
        with pytest.raises(ValueError, match="Ya existe un docente con email"):
            docente_service.registrar_docente(docente_data2)
    
    def test_obtener_docente_existente(self, docente_service, docente_data):
        """Test obtener docente existente."""
        docente_service.registrar_docente(docente_data)
        
        docente_response = docente_service.obtener_docente("12345678-9")
        
        assert docente_response is not None
        assert docente_response.docente_rut == "12345678-9"
    
    def test_obtener_docente_inexistente(self, docente_service):
        """Test obtener docente inexistente."""
        docente_response = docente_service.obtener_docente("99999999-9")
        assert docente_response is None
    
    def test_listar_docentes(self, docente_service, docente_data):
        """Test listar docentes."""
        docente_service.registrar_docente(docente_data)
        
        docentes = docente_service.listar_docentes()
        assert len(docentes) == 1
        assert docentes[0].docente_rut == "12345678-9"
    
    def test_buscar_docentes(self, docente_service, docente_data):
        """Test búsqueda de docentes."""
        docente_service.registrar_docente(docente_data)
        
        docentes = docente_service.buscar_docentes("Juan")
        assert len(docentes) == 1
        assert docentes[0].nombre == "Juan Pérez"
    
    def test_actualizar_docente_exitoso(self, docente_service, docente_data):
        """Test actualización exitosa de docente."""
        docente_service.registrar_docente(docente_data)
        
        datos_actualizacion = DocenteUpdate(
            nombre="Juan Carlos Pérez",
            max_horas_docencia=44
        )
        
        docente_actualizado = docente_service.actualizar_docente(
            "12345678-9", datos_actualizacion
        )
        
        assert docente_actualizado is not None
        assert docente_actualizado.nombre == "Juan Carlos Pérez"
        assert docente_actualizado.max_horas_docencia == 44
    
    def test_eliminar_docente_sin_clases(self, docente_service, docente_data):
        """Test eliminación de docente sin clases asignadas."""
        docente_service.registrar_docente(docente_data)
        
        resultado = docente_service.eliminar_docente("12345678-9")
        assert resultado is True
    
    def test_obtener_estadisticas_docente(self, docente_service, docente_data):
        """Test obtener estadísticas de docente."""
        docente_service.registrar_docente(docente_data)
        
        estadisticas = docente_service.obtener_estadisticas_docente("12345678-9")
        
        assert estadisticas["docente_rut"] == "12345678-9"
        assert estadisticas["nombre"] == "Juan Pérez"
        assert estadisticas["categoria"] == "Jornada Completa"
        assert estadisticas["max_horas_docencia"] == 40
        assert estadisticas["total_clases"] == 0
        assert estadisticas["horas_disponibles"] == 40
    
    def test_obtener_estadisticas_docente_inexistente(self, docente_service):
        """Test error al obtener estadísticas de docente inexistente."""
        with pytest.raises(ValueError, match="No existe docente con RUT"):
            docente_service.obtener_estadisticas_docente("99999999-9")
    
    def test_obtener_docentes_disponibles(self, docente_service, docente_data):
        """Test obtener docentes disponibles."""
        docente_service.registrar_docente(docente_data)
        
        docentes_disponibles = docente_service.obtener_docentes_disponibles(2)
        
        assert len(docentes_disponibles) == 1
        assert docentes_disponibles[0].docente_rut == "12345678-9"
    
    def test_obtener_resumen_sistema(self, docente_service, docente_data):
        """Test obtener resumen del sistema."""
        docente_service.registrar_docente(docente_data)
        
        # Crear docente de media jornada
        docente_data2 = DocenteCreate(
            docente_rut="98765432-1",
            nombre="María González",
            email="maria.gonzalez@uct.cl",
            pass_hash="hashed_password_456",
            max_horas_docencia=20
        )
        docente_service.registrar_docente(docente_data2)
        
        resumen = docente_service.obtener_resumen_sistema()
        
        assert resumen["total_docentes"] == 2
        assert resumen["distribucion_por_categoria"]["Jornada Completa"] == 1
        assert resumen["distribucion_por_categoria"]["Media Jornada"] == 1
        assert resumen["total_horas_sistema"] == 60
        assert resumen["total_horas_asignadas"] == 0


class TestDocenteIntegracion:
    """Tests de integración para flujos completos."""
    
    def test_flujo_completo_docente(self, docente_service, docente_data):
        """Test del flujo completo de gestión de docente."""
        # 1. Registrar docente
        docente_response = docente_service.registrar_docente(docente_data)
        assert docente_response.docente_rut == "12345678-9"
        
        # 2. Obtener docente
        docente_obtenido = docente_service.obtener_docente("12345678-9")
        assert docente_obtenido is not None
        
        # 3. Actualizar docente
        datos_actualizacion = DocenteUpdate(nombre="Juan Carlos Pérez")
        docente_actualizado = docente_service.actualizar_docente(
            "12345678-9", datos_actualizacion
        )
        assert docente_actualizado.nombre == "Juan Carlos Pérez"
        
        # 4. Obtener estadísticas
        estadisticas = docente_service.obtener_estadisticas_docente("12345678-9")
        assert estadisticas["categoria"] == "Jornada Completa"
        
        # 5. Eliminar docente
        resultado = docente_service.eliminar_docente("12345678-9")
        assert resultado is True
        
        # 6. Verificar eliminación
        docente_eliminado = docente_service.obtener_docente("12345678-9")
        assert docente_eliminado is None
