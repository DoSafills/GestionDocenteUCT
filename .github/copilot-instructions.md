# Instrucciones para GitHub Copilot - GestionDocenteUCT

## Estructura del Proyecto

```
project/
├── app/
│   ├── config/
│   │   └── database.py
│   │
│   ├── domain/
│   │   ├── models/               # Modelos SQLAlchemy
│   │   │   ├── __init__.py
│   │   │   ├── docente.py
│   │   │   ├── asignatura.py
│   │   │   ├── seccion.py
│   │   │   ├── sala.py
│   │   │   ├── edificio.py
│   │   │   ├── campus.py
│   │   │   ├── clase.py
│   │   │   ├── restriccion.py
│   │   │   ├── reportehoras.py
│   │   │   ├── reporte.py
│   │   │   └── bloque.py
│   │   │
│   │   ├── schemas/              # Schemas Pydantic
│   │   │   ├── __init__.py
│   │   │   ├── docente.py
│   │   │   ├── asignatura.py
│   │   │   ├── seccion.py
│   │   │   ├── sala.py
│   │   │   ├── edificio.py
│   │   │   ├── campus.py
│   │   │   ├── clase.py
│   │   │   ├── restriccion.py
│   │   │   ├── reportehoras.py
│   │   │   ├── reporte.py
│   │   │   └── bloque.py
│   │   │
│   │   └── rules.py               # Reglas de negocio (ej: validaciones de restricción)
│   │
│   ├── infrastructure/
│   │   ├── repositories/          # Repositorios por entidad
│   │   │   ├── __init__.py
│   │   │   ├── docente_repo.py
│   │   │   ├── asignatura_repo.py
│   │   │   ├── seccion_repo.py
│   │   │   ├── sala_repo.py
│   │   │   ├── edificio_repo.py
│   │   │   ├── campus_repo.py
│   │   │   ├── clase_repo.py
│   │   │   ├── restriccion_repo.py
│   │   │   ├── reportehoras_repo.py
│   │   │   ├── reporte_repo.py
│   │   │   └── bloque_repo.py
│   │   │
│   │   └── external_api.py        # Cliente para API externa (si lo ocupan)
│   │
│   ├── application/
│   │   ├── services.py            # Casos de uso (ej: generar horario, confirmar)
│   │   └── crud.py                # Orquesta repositorios en operaciones de alto nivel
│   │
│   └── main.py
│
└── tests/
    ├── test_docente.py
    ├── test_asignatura.py
    ├── test_seccion.py
    ├── test_sala.py
    ├── test_edificio.py
    ├── test_campus.py
    ├── test_clase.py
    ├── test_restriccion.py
    ├── test_reportehoras.py
    ├── test_reporte.py
    └── test_bloque.py
```

## Principios de Arquitectura

- **Clean Architecture**: Separación clara entre capas domain, infrastructure y application
- **Domain**: Contiene la lógica de negocio, modelos y schemas
- **Infrastructure**: Maneja persistencia y servicios externos
- **Application**: Orquesta casos de uso y operaciones de alto nivel

## Convenciones a Seguir

- Cada entidad debe tener su modelo SQLAlchemy, schema Pydantic, repositorio y test correspondiente
- Mantener consistencia en nombres de archivos y clases
- Seguir patrones establecidos en la estructura
- No crear apios REST o endpoints, solo la lógica y estructura del backend
- Documentar funciones y clases con docstrings
