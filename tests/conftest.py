"""
Configuración compartida para tests con PostgreSQL.
"""
import pytest
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config.database import Base
from urllib.parse import quote_plus

# Configuración para base de datos de test
TEST_DATABASE_USER = os.getenv("TEST_DATABASE_USER", "postgres")
TEST_DATABASE_PASSWORD = os.getenv("TEST_DATABASE_PASSWORD", "postgres")
TEST_DATABASE_HOST = os.getenv("TEST_DATABASE_HOST", "localhost")
TEST_DATABASE_PORT = os.getenv("TEST_DATABASE_PORT", "5432")
TEST_DATABASE_NAME = os.getenv("TEST_DATABASE_NAME", "gestion_docente_test")

TEST_DATABASE_URL = f"postgresql://{TEST_DATABASE_USER}:{quote_plus(TEST_DATABASE_PASSWORD)}@{TEST_DATABASE_HOST}:{TEST_DATABASE_PORT}/{TEST_DATABASE_NAME}"


@pytest.fixture(scope="session")
def test_db_engine():
    """Engine de base de datos PostgreSQL para tests."""
    engine = create_engine(TEST_DATABASE_URL, echo=False)
    
    # Crear todas las tablas
    Base.metadata.create_all(engine)
    
    yield engine
    
    # Limpiar después de todos los tests
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture(scope="function")
def test_db_session(test_db_engine):
    """
    Sesión de base de datos para tests con rollback automático.
    Cada test se ejecuta en una transacción que se revierte.
    """
    connection = test_db_engine.connect()
    transaction = connection.begin()
    SessionLocal = sessionmaker(bind=connection)
    session = SessionLocal()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def clean_db(test_db_session):
    """
    Fixture para limpiar la base de datos antes de cada test.
    """
    # Limpiar todas las tablas en orden inverso de dependencias
    tables = ['docente_clase', 'clases', 'docentes', 'secciones', 'asignaturas', 
             'salas', 'edificios', 'campus', 'bloques', 'restricciones', 
             'reportes', 'reporte_horas']
    
    for table in tables:
        try:
            test_db_session.execute(text(f"TRUNCATE TABLE {table} CASCADE"))
        except Exception:
            # La tabla puede no existir todavía
            pass
    
    test_db_session.commit()
    yield test_db_session


@pytest.fixture
def sample_docente_data():
    """Datos de ejemplo para docente."""
    from app.domain.schemas.docente import DocenteCreate
    
    return DocenteCreate(
        docente_rut="11111111-1",
        nombre="Test Docente",
        email="test@uct.cl",
        pass_hash="test_hash",
        max_horas_docencia=40
    )


@pytest.fixture
def sample_docente_data_list():
    """Lista de datos de ejemplo para múltiples docentes."""
    from app.domain.schemas.docente import DocenteCreate
    
    return [
        DocenteCreate(
            docente_rut="11111111-1",
            nombre="Juan Pérez",
            email="juan.perez@uct.cl",
            pass_hash="hash1",
            max_horas_docencia=44
        ),
        DocenteCreate(
            docente_rut="22222222-2",
            nombre="María González",
            email="maria.gonzalez@uct.cl",
            pass_hash="hash2",
            max_horas_docencia=30
        ),
        DocenteCreate(
            docente_rut="33333333-3",
            nombre="Carlos Silva",
            email="carlos.silva@uct.cl",
            pass_hash="hash3",
            max_horas_docencia=15
        )
    ]


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """
    Configuración inicial de la base de datos de test.
    Se ejecuta una vez por sesión de testing.
    """
    # Crear base de datos de test si no existe
    admin_url = f"postgresql://{TEST_DATABASE_USER}:{quote_plus(TEST_DATABASE_PASSWORD)}@{TEST_DATABASE_HOST}:{TEST_DATABASE_PORT}/postgres"
    admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
    
    try:
        with admin_engine.connect() as conn:
            # Verificar si la BD de test existe
            result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname='{TEST_DATABASE_NAME}'"))
            if not result.fetchone():
                conn.execute(text(f"CREATE DATABASE {TEST_DATABASE_NAME}"))
    except Exception as e:
        print(f"Warning: Could not create test database: {e}")
    finally:
        admin_engine.dispose()
    
    yield
    
    # Limpiar después de todos los tests
    try:
        with admin_engine.connect() as conn:
            # Terminar conexiones activas
            conn.execute(text(f"""
                SELECT pg_terminate_backend(pid)
                FROM pg_stat_activity
                WHERE datname = '{TEST_DATABASE_NAME}' AND pid <> pg_backend_pid()
            """))
            # Eliminar base de datos de test
            conn.execute(text(f"DROP DATABASE IF EXISTS {TEST_DATABASE_NAME}"))
    except Exception as e:
        print(f"Warning: Could not cleanup test database: {e}")
    finally:
        admin_engine.dispose()
