"""
Configuración centralizada de la aplicación usando variables de entorno.
"""
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde archivo .env
load_dotenv()

class Settings:
    """Configuración centralizada de la aplicación."""
    
    # Configuración de la aplicación
    APP_NAME: str = os.getenv("APP_NAME", "GestionDocenteUCT")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Configuración de base de datos
    DATABASE_USER: str = os.getenv("DATABASE_USER", "postgres")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "postgres")
    DATABASE_HOST: str = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT: str = os.getenv("DATABASE_PORT", "5432")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "gestion_docente_uct")
    
    # Configuración de base de datos para tests
    TEST_DATABASE_USER: str = os.getenv("TEST_DATABASE_USER", DATABASE_USER)
    TEST_DATABASE_PASSWORD: str = os.getenv("TEST_DATABASE_PASSWORD", DATABASE_PASSWORD)
    TEST_DATABASE_HOST: str = os.getenv("TEST_DATABASE_HOST", DATABASE_HOST)
    TEST_DATABASE_PORT: str = os.getenv("TEST_DATABASE_PORT", DATABASE_PORT)
    TEST_DATABASE_NAME: str = os.getenv("TEST_DATABASE_NAME", "gestion_docente_test")
    
    # Configuración de logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT", "json")
    
    # Configuración de SQL Debug
    SQL_DEBUG: bool = os.getenv("SQL_DEBUG", "false").lower() == "true"
    
    # Detectar si estamos en modo test
    IS_TESTING: bool = os.getenv("PYTEST_CURRENT_TEST") is not None
    
    @property
    def database_url(self) -> str:
        """Construye la URL de conexión a la base de datos."""
        from urllib.parse import quote_plus
        
        if self.IS_TESTING:
            user = self.TEST_DATABASE_USER
            password = self.TEST_DATABASE_PASSWORD
            host = self.TEST_DATABASE_HOST
            port = self.TEST_DATABASE_PORT
            name = self.TEST_DATABASE_NAME
        else:
            user = self.DATABASE_USER
            password = self.DATABASE_PASSWORD
            host = self.DATABASE_HOST
            port = self.DATABASE_PORT
            name = self.DATABASE_NAME
            
        return f"postgresql://{user}:{quote_plus(password)}@{host}:{port}/{name}"
    
    @property
    def is_development(self) -> bool:
        """Verifica si estamos en entorno de desarrollo."""
        return self.ENVIRONMENT.lower() == "development"
    
    @property
    def is_production(self) -> bool:
        """Verifica si estamos en entorno de producción."""
        return self.ENVIRONMENT.lower() == "production"

# Instancia global de configuración
settings = Settings()
