"""
Configuración compartida para tests con PostgreSQL.
"""
import pytest
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from Backend.config.database import Base
from Backend.domain.models.docente import Docente
from Backend.domain.models.clase import Clase
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración para base de datos de test
TEST_DATABASE_USER = os.getenv("TEST_DATABASE_USER", "postgres")
TEST_DATABASE_PASSWORD = os.getenv("TEST_DATABASE_PASSWORD", "postgres")
TEST_DATABASE_HOST = os.getenv("TEST_DATABASE_HOST", "localhost")
TEST_DATABASE_PORT = os.getenv("TEST_DATABASE_PORT", "5432")
TEST_DATABASE_NAME = os.getenv("TEST_DATABASE_NAME", "gestion_docente_test")

TEST_DATABASE_URL = f"postgresql://{TEST_DATABASE_USER}:{quote_plus(TEST_DATABASE_PASSWORD)}@{TEST_DATABASE_HOST}:{TEST_DATABASE_PORT}/{TEST_DATABASE_NAME}"

@pytest.fixture(scope="session")
def test_db_engine():
    """Engine de base de datos para tests."""
    engine = create_engine(
        TEST_DATABASE_URL, 
        echo=False,
        pool_pre_ping=True
    )
    
    # Crear todas las tablas
    Base.metadata.create_all(engine, checkfirst=True)
    
    yield engine
    
    engine.dispose()
    


@pytest.fixture(scope="function") 
def test_db_session(test_db_engine):
    """Sesión de base de datos para tests."""
    connection = test_db_engine.connect()
    transaction = connection.begin()
    SessionLocal = sessionmaker(bind=connection)
    session = SessionLocal()
    
    yield session
    
    session.close()
    if transaction.is_active:
        transaction.commit()
    connection.close()

@pytest.fixture
def clean_db(test_db_session):
    """Fixture que limpia las tablas antes del test."""
    test_db_session.query(Clase).delete()
    test_db_session.query(Docente).delete()
    test_db_session.commit()
    yield test_db_session

@pytest.fixture
def sample_docente_data():
    """Datos de ejemplo para docente."""
    from Backend.domain.schemas.docente import DocenteCreate
    
    return DocenteCreate(
        docente_rut="12345678-9",
        nombre="Profesor Test",
        email="profesor.test@uct.cl",
        max_horas_docencia=40,
        pass_hash="password_hash"
    )

@pytest.fixture
def sample_docente_data_list():
    """Lista de datos de ejemplo para múltiples docentes."""
    from Backend.domain.schemas.docente import DocenteCreate
    
    return [
        DocenteCreate(
            docente_rut="11111111-1",
            nombre="Profesor Uno",
            email="profesor.uno@uct.cl",
            max_horas_docencia=40,
            pass_hash="hash1"
        ),
        DocenteCreate(
            docente_rut="22222222-2", 
            nombre="Profesor Dos",
            email="profesor.dos@uct.cl",
            max_horas_docencia=30,
            pass_hash="hash2"
        ),
        DocenteCreate(
            docente_rut="33333333-3",
            nombre="Profesor Tres", 
            email="profesor.tres@uct.cl",
            max_horas_docencia=20,
            pass_hash="hash3"
        )
    ]
