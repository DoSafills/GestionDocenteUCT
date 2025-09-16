"""
Configuración de conexión a base de datos PostgreSQL con SQLAlchemy 2.0
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .settings import settings

# Configuración del engine con pool de conexiones para PostgreSQL
engine = create_engine(
    settings.database_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.SQL_DEBUG
)

# Configuración de sesión
SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine,
    expire_on_commit=False
)

# Base declarativa para modelos ORM usando SQLAlchemy 2.0
class Base(DeclarativeBase):
    pass

def get_db():
    """
    Generador de sesiones de base de datos para dependency injection.
    Manejo automático de cierre de sesión.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_session():
    """
    Obtener sesión de base de datos directamente.
    Para uso en servicios y repositorios.
    IMPORTANTE: Cerrar manualmente la sesión cuando termine.
    """
    return SessionLocal()

def init_db():
    """
    Inicializar base de datos creando todas las tablas.
    Solo para desarrollo/testing.
    """
    Base.metadata.create_all(bind=engine)

def close_db_connections():
    """
    Cerrar todas las conexiones del pool.
    Para limpieza en shutdown de aplicación.
    """
    engine.dispose()

