# 🤝 Guía de Contribución

## 📋 Antes de Contribuir

1. **Fork** el repositorio
2. **Clona** tu fork localmente
3. **Crea** una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
4. **Configura** el entorno de desarrollo

## 🔧 Configuración de Desarrollo

```bash
# Instalar pre-commit hooks
pre-commit install

# Ejecutar tests antes de commit
pytest

# Verificar formato de código
black --check app/ tests/
isort --check-only app/ tests/
flake8 app/ tests/
mypy app/
```

## 📝 Estándares de Código

### Python
- **Formateo**: Black (line-length=88)
- **Imports**: isort con perfil black
- **Type hints**: Obligatorios en funciones públicas
- **Docstrings**: Estilo Google

### Commits
```
<tipo>: <descripción>

Tipos válidos:
- feat: Nueva funcionalidad
- fix: Corrección de bug
- docs: Documentación
- style: Formateo (no afecta funcionalidad)
- refactor: Refactorización
- test: Tests
- chore: Tareas de mantenimiento
```


## 📖 Pull Requests

1. **Título descriptivo** del cambio
2. **Descripción detallada** de qué se cambió y por qué
3. **Tests** que validen los cambios
4. **Documentación** actualizada si es necesario
