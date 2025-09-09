# Manual de Arquitectura - GestionDocenteUCT

## Introducción

Este manual describe la arquitectura del sistema de gestión docente basada en **Clean Architecture**, proporcionando guías para el desarrollo y mantenimiento del código.

## Principios Arquitectónicos

### 1. Clean Architecture

La aplicación sigue los principios de Clean Architecture con separación clara de responsabilidades:

```
┌──────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTERFACES                       │
│                  (API REST, CLI, Tests)                     │
└──────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│                     (Services)                              │
│  - Casos de uso                                             │
│  - Orquestación de operaciones                             │
│  - Validaciones de negocio de alto nivel                   │
└──────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                        │
│                   (Repositories)                            │
│  - Persistencia de datos                                   │
│  - Servicios externos                                      │
│  - Implementación de interfaces                            │
└──────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                            │
│              (Models, Schemas, Rules)                       │
│  - Entidades de negocio                                    │
│  - Reglas de dominio                                       │
│  - Validaciones de datos                                   │
└──────────────────────────────────────────────────────────────┘
```

### 2. Inversión de Dependencias

Las capas superiores no dependen de las inferiores directamente, sino de abstracciones.

### 3. Responsabilidad Única

Cada clase y módulo tiene una única responsabilidad bien definida.

## Estructura del Proyecto

### Domain Layer (`app/domain/`)

**Responsabilidad**: Contiene la lógica de negocio pura y las entidades del dominio.

#### Models (`app/domain/models/`)
```python
# Ejemplo: docente.py
from sqlalchemy import Column, String, Integer
from app.config.database import Base

class Docente(Base):
    __tablename__ = "docentes"
    
    docente_rut = Column(String, primary_key=True)
    nombre = Column(String(70))
    # ... otros campos
```

**Características**:
- Definición de entidades con SQLAlchemy
- Sin lógica de negocio compleja
- Relaciones entre entidades
- Única fuente de verdad para el modelo de datos

#### Schemas (`app/domain/schemas/`)
```python
# Ejemplo: docente.py
from pydantic import BaseModel, EmailStr, Field

class DocenteCreate(BaseModel):
    docente_rut: str = Field(..., max_length=12)
    nombre: str = Field(..., max_length=70)
    email: EmailStr
    # ... validaciones
```

**Características**:
- Validación de entrada y salida de datos
- Serialización/deserialización
- Documentación automática de API
- Tipos seguros

#### Factories (`app/domain/factories/`)
```python
# Ejemplo: docente_factory.py
class DocenteFactory:
    @staticmethod
    def crear_docente(datos: DocenteCreate) -> Docente:
        # Validaciones complejas
        # Lógica de creación
        return Docente(...)
```

**Características**:
- Encapsula lógica de creación compleja
- Validaciones de negocio específicas
- Patrones de creación reutilizables

### Infrastructure Layer (`app/infrastructure/`)

**Responsabilidad**: Maneja la persistencia y servicios externos.

#### Repositories (`app/infrastructure/repositories/`)
```python
# Ejemplo: docente_repo.py
class DocenteRepository:
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def crear_docente(self, datos: DocenteCreate) -> Docente:
        # Lógica de persistencia
        pass
    
    def obtener_docente_por_rut(self, rut: str) -> Optional[Docente]:
        # Consulta a base de datos
        pass
```

**Patrones implementados**:
- Repository Pattern
- Abstracción de persistencia
- Manejo de transacciones
- Consultas específicas por entidad

### Application Layer (`app/application/`)

**Responsabilidad**: Orquesta casos de uso y coordina operaciones.

#### Services (`app/application/services/`)
```python
# Ejemplo: docente_service.py
class DocenteService:
    def __init__(self, db_session: Session = None):
        self.repo = DocenteRepository(db_session)
    
    def registrar_docente(self, datos: DocenteCreate) -> DocenteResponse:
        # Validaciones de alto nivel
        # Orquestación de operaciones
        # Aplicación de reglas de negocio
        pass
```

**Características**:
- Casos de uso del sistema
- Coordinación entre repositorios
- Validaciones de negocio complejas
- Transformación de datos

## Patrones de Diseño Implementados

### 1. Repository Pattern

```python
# Interfaz implícita
class DocenteRepository:
    def crear_docente(self, datos: DocenteCreate) -> Docente: ...
    def obtener_docente_por_rut(self, rut: str) -> Optional[Docente]: ...
    def listar_docentes(self, skip: int, limit: int) -> List[Docente]: ...
```

**Beneficios**:
- Abstrae la capa de datos
- Facilita testing con mocks
- Permite cambio de tecnología de persistencia

### 2. Factory Pattern

```python
class DocenteFactory:
    @staticmethod
    def crear_docente(datos: DocenteCreate) -> Docente:
        # Lógica compleja de creación
        return Docente(...)
```

**Beneficios**:
- Encapsula lógica de creación
- Reutilización de código
- Validaciones centralizadas

### 3. Service Layer Pattern

```python
class DocenteService:
    def registrar_docente(self, datos: DocenteCreate) -> DocenteResponse:
        # Coordina múltiples operaciones
        # Aplica reglas de negocio
        pass
```

**Beneficios**:
- Centraliza casos de uso
- Coordina múltiples repositorios
- Facilita testing de lógica de negocio

## Guías de Desarrollo

### 1. Creando una Nueva Entidad

**Paso 1**: Crear el modelo
```python
# app/domain/models/nueva_entidad.py
class NuevaEntidad(Base):
    __tablename__ = "nuevas_entidades"
    id = Column(Integer, primary_key=True)
    # ... campos
```

**Paso 2**: Crear los schemas
```python
# app/domain/schemas/nueva_entidad.py
class NuevaEntidadBase(BaseModel):
    campo: str

class NuevaEntidadCreate(NuevaEntidadBase):
    pass

class NuevaEntidadResponse(NuevaEntidadBase):
    id: int
    class Config:
        from_attributes = True
```

**Paso 3**: Crear el repositorio
```python
# app/infrastructure/repositories/nueva_entidad_repo.py
class NuevaEntidadRepository:
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def crear(self, datos: NuevaEntidadCreate) -> NuevaEntidad:
        # Implementar CRUD básico
        pass
```

**Paso 4**: Crear el servicio
```python
# app/application/services/nueva_entidad_service.py
class NuevaEntidadService:
    def __init__(self, db_session: Session = None):
        self.repo = NuevaEntidadRepository(db_session)
    
    def registrar(self, datos: NuevaEntidadCreate) -> NuevaEntidadResponse:
        # Implementar casos de uso
        pass
```

**Paso 5**: Crear tests
```python
# tests/test_nueva_entidad.py
def test_crear_nueva_entidad():
    # Test de integración
    pass
```

### 2. Agregando Nueva Funcionalidad

1. **Identifica la capa apropiada**:
   - Domain: Nuevas validaciones o reglas de negocio
   - Infrastructure: Nueva forma de persistencia
   - Application: Nuevo caso de uso

2. **Sigue el patrón existente**:
   - Usa los mismos nombres de métodos
   - Mantén la misma estructura de parámetros
   - Implementa manejo de errores consistente

3. **Agrega tests**:
   - Test unitario para lógica de negocio
   - Test de integración para flujo completo

### 3. Manejo de Errores

```python
# Errores de negocio
class ErrorNegocio(Exception):
    """Excepción base para errores de negocio"""
    pass

class DocenteNoEncontrado(ErrorNegocio):
    """Docente no encontrado en el sistema"""
    pass

# En servicios
def obtener_docente(self, rut: str) -> DocenteResponse:
    docente = self.repo.obtener_docente_por_rut(rut)
    if not docente:
        raise DocenteNoEncontrado(f"Docente con RUT {rut} no encontrado")
    return DocenteResponse.model_validate(docente)
```

### 4. Testing

#### Test Unitario (Domain/Application)
```python
def test_validacion_horas_docente():
    with pytest.raises(ValueError):
        DocenteFactory.crear_docente(DocenteCreate(
            max_horas_docencia=-1  # Valor inválido
        ))
```

#### Test de Integración (Infrastructure)
```python
def test_crear_docente_repositorio(db_session):
    repo = DocenteRepository(db_session)
    docente_data = DocenteCreate(...)
    
    docente = repo.crear_docente(docente_data)
    
    assert docente.nombre == docente_data.nombre
    assert db_session.query(Docente).count() == 1
```

### 5. Configuración de Base de Datos

```python
# app/config/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://user:pass@localhost/db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db_session():
    return SessionLocal()
```

## Mejores Prácticas

### 1. Nomenclatura

- **Clases**: PascalCase (`DocenteService`)
- **Métodos**: snake_case (`crear_docente`)
- **Variables**: snake_case (`docente_rut`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_HORAS_DOCENCIA`)

### 2. Documentación

```python
def metodo_ejemplo(self, parametro: str) -> bool:
    """
    Breve descripción del método.
    
    Args:
        parametro: Descripción del parámetro
        
    Returns:
        Descripción del valor de retorno
        
    Raises:
        ValueError: Cuándo se lanza esta excepción
    """
    pass
```

### 3. Validaciones

- **En Schemas**: Validaciones de formato y tipo
- **En Factories**: Validaciones de reglas de negocio
- **En Services**: Validaciones de estado y consistencia

### 4. Transacciones

```python
def operacion_compleja(self):
    try:
        # Múltiples operaciones
        self.db.add(entidad1)
        self.db.add(entidad2)
        self.db.commit()
    except Exception:
        self.db.rollback()
        raise
```

### 5. Logging

```python
import logging

logger = logging.getLogger(__name__)

def metodo_con_logging(self):
    logger.info("Iniciando operación importante")
    try:
        # Operación
        logger.info("Operación completada exitosamente")
    except Exception as e:
        logger.error(f"Error en operación: {e}")
        raise
```

## Extensibilidad

### Agregando Nuevas Capas

1. **Presentation Layer** (API REST):
```
app/
├── presentation/
│   ├── api/
│   │   └── docente_router.py
│   └── middleware/
```

2. **External Services**:
```
app/
├── infrastructure/
│   ├── external/
│   │   ├── email_service.py
│   │   └── ldap_service.py
```

### Agregando Validaciones Complejas

```python
# app/domain/rules.py
class ReglasDocente:
    @staticmethod
    def validar_asignacion_clase(docente: Docente, clase: Clase) -> bool:
        # Lógica compleja de validación
        pass
```

## Herramientas de Desarrollo

### Dependencias Principales
- **SQLAlchemy**: ORM para base de datos
- **Pydantic**: Validación y serialización
- **PostgreSQL**: Base de datos principal
- **pytest**: Framework de testing

### Comandos Útiles
```bash
# Ejecutar tests
pytest tests/

# Generar migración
alembic revision --autogenerate -m "mensaje"

# Aplicar migraciones
alembic upgrade head

# Verificar tipos
mypy app/
```

## Conclusión

Esta arquitectura proporciona:
- **Mantenibilidad**: Código organizado y fácil de modificar
- **Testabilidad**: Separación clara para testing unitario
- **Escalabilidad**: Estructura que soporta crecimiento
- **Flexibilidad**: Fácil cambio de tecnologías de infraestructura

Sigue estas guías para mantener la consistencia y calidad del código en el proyecto GestionDocenteUCT.
