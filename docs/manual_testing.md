# Manual de Testing - GestionDocenteUCT

## Descripción

Este manual describe cómo ejecutar y trabajar con tests en el proyecto GestionDocenteUCT usando pytest.

## Estructura de Tests

```
tests/
├── conftest.py         # Configuración y fixtures compartidas
├── test_docente.py     # Tests del módulo docente
└── __init__.py         # Marca el directorio como paquete Python
```

### Organización por Clases

- **TestDocenteFactory**: Tests de lógica de negocio (categorías, validaciones)
- **TestDocenteRepository**: Tests de operaciones CRUD en base de datos  
- **TestDocenteService**: Tests de servicios de aplicación
- **TestDocenteIntegracion**: Tests de flujos completos end-to-end

## Configuración Previa

### Base de Datos de Test

El proyecto usa PostgreSQL local para tests. Asegúrate de tener:

1. **PostgreSQL instalado** y corriendo
2. **Base de datos creada**:
   ```bash
   createdb -U postgres gestion_docente_test
   ```
3. **Variables de entorno** configuradas en `.env`:
   ```env
   TEST_DATABASE_NAME=gestion_docente_test
   TEST_DATABASE_HOST=localhost
   TEST_DATABASE_PORT=5432
   TEST_DATABASE_USER=postgres
   TEST_DATABASE_PASSWORD=admin
   ```

### Inicializar Esquema

```bash
python setup_test_db.py
```

## Comandos de Ejecución

### Comandos Básicos

```bash
# Ejecutar todos los tests
pytest

# Con mayor verbosidad (recomendado)
pytest -v

# Solo tests de docente
pytest tests/test_docente.py

# Tests específicos por clase
pytest tests/test_docente.py::TestDocenteRepository -v
```

### Tests Específicos

```bash
# Un test específico
pytest tests/test_docente.py::TestDocenteRepository::test_crear_docente_exitoso -v

# Factory tests
pytest tests/test_docente.py::TestDocenteFactory -v

# Service tests  
pytest tests/test_docente.py::TestDocenteService -v

# Integration tests
pytest tests/test_docente.py::TestDocenteIntegracion -v
```

## Debugging

### Información Detallada

```bash
# Traceback completo en errores
pytest -v --tb=long

# Variables locales en el traceback
pytest -v --tb=long --showlocals

# Solo mostrar errores, sin output de tests exitosos
pytest --tb=short
```

### Debugging Interactivo

```bash
# Entrar al debugger en fallos
pytest --pdb

# Detener en el primer fallo
pytest -x

# Detener después de N fallos
pytest --maxfail=3
```

### Output Detallado

```bash
# Mostrar print statements
pytest -s

# Capturar solo en fallos
pytest --capture=no
```

## Configuración de Fixtures

El archivo `conftest.py` proporciona las siguientes fixtures:

### Fixtures de Base de Datos

- **test_db_engine**: Motor de BD para toda la sesión de tests
- **test_db_session**: Sesión de BD para cada test individual
- **clean_db**: Limpia las tablas antes del test

### Fixtures de Datos

- **sample_docente_data**: Datos de ejemplo para un docente
- **sample_docente_data_list**: Lista de datos para múltiples docentes

### Uso de Fixtures

```python
def test_crear_docente(clean_db, sample_docente_data):
    # clean_db proporciona una BD limpia
    # sample_docente_data proporciona datos de prueba
    repo = DocenteRepository(clean_db)
    docente = repo.crear_docente(sample_docente_data)
    assert docente.nombre == "Profesor Test"
```

## Verificación del Entorno

### Verificar Conexión a BD

```bash
# Probar conexión rápida
python -c "
from app.config.settings import settings
from sqlalchemy import create_engine, text
engine = create_engine(settings.database_url)
with engine.connect() as conn:
    result = conn.execute(text('SELECT 1'))
    print(f'Conexión OK: {result.scalar()}')
"
```

### Verificar Variables de Entorno

```bash
python -c "
from app.config.settings import settings
print(f'BD Test: {settings.TEST_DATABASE_HOST}:{settings.TEST_DATABASE_PORT}/{settings.TEST_DATABASE_NAME}')
print(f'Usuario: {settings.TEST_DATABASE_USER}')
"
```

## Comandos Útiles

### Limpiar Cache

```bash
# Limpiar cache de pytest
pytest --cache-clear

# Eliminar archivos de cache
rm -rf .pytest_cache
rm -rf **/__pycache__
```

### Análisis de Rendimiento

```bash
# Mostrar los tests más lentos
pytest --durations=10

# Mostrar todos los tiempos
pytest --durations=0
```

### Ejecutar Tests en Paralelo

```bash
# Requiere pytest-xdist instalado
pip install pytest-xdist

# Ejecutar en paralelo
pytest -n auto
```

## Resolución de Problemas Comunes

### Error de Conexión a BD

1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en `.env`
3. Verificar que la BD `gestion_docente_test` exista

### Tests Fallan por Datos Existentes

```bash
# Usar fixture clean_db para tests que requieren BD limpia
def test_listar_vacio(clean_db):
    repo = DocenteRepository(clean_db)
    docentes = repo.listar_docentes()
    assert len(docentes) == 0
```

### Import Errors

1. Verificar que estés en el directorio raíz del proyecto
2. Verificar que `PYTHONPATH` incluya el directorio del proyecto
3. Verificar que todos los `__init__.py` existan

## Estado Actual de Tests

El proyecto incluye **30 tests** que cubren:

- ✅ Factory: Lógica de categorización de docentes (3 tests)
- ✅ Repository: Operaciones CRUD completas (13 tests)  
- ✅ Service: Lógica de negocio y validaciones (13 tests)
- ✅ Integration: Flujo completo del sistema (1 test)

### Cobertura por Módulo

- **Docente**: 100% de funcionalidades básicas
- **Clase**: Modelo implementado, tests pendientes
- **Otros módulos**: Pendientes de implementación

## Mejores Prácticas

1. **Usar fixtures** para configurar datos de prueba
2. **Limpiar estado** entre tests cuando sea necesario
3. **Tests independientes** - cada test debe poder ejecutarse solo
4. **Nombres descriptivos** - el nombre del test debe explicar qué verifica
5. **Un assert por concepto** - facilita identificar qué falló

## Ejemplo Completo

```python
def test_flujo_completo_docente(clean_db, sample_docente_data):
    """Test que verifica el flujo completo de gestión de docente."""
    repo = DocenteRepository(clean_db)
    service = DocenteService(clean_db)
    
    # 1. Registrar docente
    docente = service.registrar_docente(sample_docente_data)
    assert docente.nombre == "Profesor Test"
    
    # 2. Buscar docente
    encontrado = service.obtener_docente(docente.docente_rut)
    assert encontrado is not None
    assert encontrado.email == sample_docente_data.email
    
    # 3. Actualizar docente
    datos_update = DocenteUpdate(nombre="Profesor Actualizado")
    actualizado = service.actualizar_docente(docente.docente_rut, datos_update)
    assert actualizado.nombre == "Profesor Actualizado"
    
    # 4. Eliminar docente
    eliminado = service.eliminar_docente(docente.docente_rut)
    assert eliminado is True
    
    # 5. Verificar eliminación
    no_encontrado = service.obtener_docente(docente.docente_rut)
    assert no_encontrado is None
```

---

**Nota**: Este manual se enfoca en el uso práctico de pytest. Para detalles de arquitectura, consultar `manual_arquitectura.md`.
