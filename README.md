<div align="center">

# 🎓 GestionDocenteUCT

### Sistema de Gestión Docente - Universidad Católica de Temuco

*Proyecto de Integración II*

[![Python](https://img.shields.io/badge/Python-3.9+-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://sqlalchemy.org)
[![Pydantic](https://img.shields.io/badge/Pydantic-V2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)](https://pydantic.dev)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## 📋 Tabla de Contenidos

- [🎯 Descripción](#-descripción)
- [✨ Características](#-características)
- [🛠️ Tecnologías](#️-tecnologías)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Instalación](#-instalación)
- [📊 Base de Datos](#-base-de-datos)
- [🧪 Testing](#-testing)
- [📚 Documentación](#-documentación)
- [👥 Equipo](#-equipo)
- [🔗 Enlaces](#-enlaces)

---

## 🎯 Descripción

**GestionDocenteUCT** es un sistema integral para la gestión de docentes y asignación de clases en la Universidad Católica de Temuco. El proyecto implementa una arquitectura limpia (Clean Architecture) que permite una gestión eficiente de:

- 👨‍🏫 **Gestión de Docentes**: Registro, actualización y categorización
- 📚 **Asignación de Clases**: Control de horarios y disponibilidad
- 📊 **Reportes y Estadísticas**: Análisis de carga docente
- 🏢 **Gestión de Campus**: Edificios, salas y recursos

---

## ✨ Características

### 🔧 Funcionales
- ✅ **CRUD Completo de Docentes** con validaciones de negocio
- ✅ **Categorización Automática** por horas de trabajo (Completa/Media/Parcial)
- ✅ **Asignación Inteligente** de clases con control de disponibilidad
- ✅ **Estadísticas en Tiempo Real** del sistema
- ✅ **Búsqueda Avanzada** por múltiples criterios
- ✅ **Validación de Restricciones** académicas

### 🎨 Técnicas
- 🏗️ **Clean Architecture** con separación de capas
- 🔒 **Type Safety** con Pydantic y SQLAlchemy 2.0
- 📦 **Inyección de Dependencias**
- 📊 **PostgreSQL** como motor de base de datos
---

## 🛠️ Tecnologías

### Backend
```yaml
Framework:     Clean Architecture + Python 3.9+
ORM:           SQLAlchemy 2.0.23+
Validación:    Pydantic 2.5.0+
Base de Datos: PostgreSQL 15+
Migrations:    Alembic 1.13.1+
Testing:       pytest 7.4.3+
```

### Frontend
```yaml
Framework:     React 18+
Build Tool:    Vite 5+
Language:      TypeScript/JavaScript
Styling:       CSS Modules / Styled Components
```

---

## 🏗️ Arquitectura

```
📦 GestionDocenteUCT/
├── 🎯 app/
│   ├── 🔧 config/          # Configuración de BD y settings
│   ├── 🏛️ domain/          # Lógica de negocio
│   │   ├── models/         # Entidades SQLAlchemy
│   │   ├── schemas/        # Validaciones Pydantic
│   │   ├── factories/      # Patrones de creación
│   │   └── rules.py        # Reglas de negocio
│   ├── 🏗️ infrastructure/   # Persistencia y servicios externos
│   │   └── repositories/   # Acceso a datos
│   ├── 🚀 application/     # Casos de uso y servicios
│   │   └── services/       # Lógica de aplicación
│   └── main.py            # Punto de entrada
├── 🧪 tests/              # Suite de testing
├── 📚 docs/               # Documentación
└── 🎨 frontend/           # Aplicación React (próximamente)
```
---

##📌 Propuesta de Estructura
```
GDUCT/
backend/
 ├── app/
 │   ├── __init__.py
 │   ├── main.py          # punto de entrada FastAPI
 │   ├── db.py            # conexión a PostgreSQL
 │   ├── routes/          # controladores de rutas (API endpoints)
 │   │   ├── __init__.py
 │   │   ├── docentes.py
 │   │   ├── salas.py
 │   │   └── clases.py
 │   ├── models/          # esquemas Pydantic / ORM
 │   │   ├── __init__.py
 │   │   ├── docente.py
 │   │   ├── sala.py
 │   │   └── clase.py
 │   ├── services/        # lógica de negocio (ej: validaciones, reportes)
 │   │   ├── __init__.py
 │   │   └── carga_docente.py
 │   └── utils/           # utilidades (logs, helpers)
 │       └── logger.py
 ├── tests/               # pruebas unitarias
 ├── requirements.txt     # dependencias del proyecto
 ├── .env.example         # variables de entorno de ejemplo
 └── README.md            # documentación inicial


├── frontend/
│   ├── src/
│   │   ├── components/       # UI generica (Botones, Card, etc.)
│   │   ├── pages/            # vistas principales (Login, Dashboard, Horarios)
│   │   ├── services/         # llamadas a API (mock ahora, fetch después)
│   │   ├── hooks/            # custom hooks
│   │   ├── context/          # estados globales (ej: AuthContext, HorariosContext)
│   │   └── App.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── db/
    ├── scripts/              # SQL inicial (el DDL que ya definimos)
    │   └── 001_init.sql
    ├── migrations/           # migraciones  (002_add_x.sql)
    └── seeds/                # datos de prueba (campus, salas, docentes)
```

### Principios Arquitectónicos

- **🎯 Domain-Driven Design**: El dominio dicta la estructura
- **🔄 Dependency Inversion**: Abstracciones sobre implementaciones
- **🧩 Single Responsibility**: Cada clase tiene una responsabilidad
- **🔒 Interface Segregation**: Interfaces específicas y cohesivas

---

## 🚀 Instalación

### Prerrequisitos
```bash
# Verificar versiones
python --version    # >= 3.9
psql --version     # PostgreSQL 12+
```

### 1️⃣ Clonar Repositorio
```bash
git clone https://github.com/tu-usuario/GestionDocenteUCT.git
cd GestionDocenteUCT
```

### 2️⃣ Configurar Entorno Virtual
```bash
# Crear entorno virtual
python -m venv venv

# Activar (Linux/Mac)
source venv/bin/activate

# Activar (Windows)
venv\Scripts\activate
```

### 3️⃣ Instalar Dependencias
```bash
# Dependencias de producción
pip install -r requirements.txt

# Dependencias de desarrollo
pip install -r requirements-dev.txt

# O usando pyproject.toml
pip install -e ".[dev]"
```

### 4️⃣ Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar configuración
nano .env
```

### 6️⃣ Ejecutar Tests
```bash
# Tests completos
pytest

# Tests con cobertura
pytest --cov=app --cov-report=html

# Tests específicos
pytest tests/test_docente.py -v
```

---

### Categorías de Docentes

| Categoría | Horas Mínimas | Horas Máximas |
|-----------|---------------|---------------|
| 🟢 **Jornada Completa** | 40 horas | 44 horas |
| 🟡 **Media Jornada** | 20 horas | 39 horas |
| 🔴 **Jornada Parcial** | 4 horas | 19 horas |

---

## 📚 Documentación

### 📖 Recursos Disponibles

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [🏗️ Manual de Arquitectura](docs/manual_arquitectura.md) | Guía completa de arquitectura | ✅ Completo |
| [🔄 Flujo de Docentes](docs/flujo_docentes.md) | Casos de uso y operaciones | ✅ Completo |
| [📊 Modelo ER](https://www.mermaidchart.com/app/projects/bd96d597-d74a-46ab-898d-4e1683352121/diagrams/a9fbfefb-fe41-4325-93e9-fb365b497c2f/version/v0.1/edit) | Diagrama de base de datos | ✅ Actualizado |
| [🎨 Diseño UI/UX](https://www.figma.com/design/ZLHl9yM5ypwcp0QV7pWRFb/Dise%C3%B1o-GDU?node-id=0-1&t=fO9DcDzrdC0ghbuk-0) | Mockups y diseño | 🚧 En progreso |

### 🚀 API Reference (Próximamente)
```bash
# Generar documentación automática
sphinx-build -b html docs/ docs/_build/
```

---

## 👥 Equipo

### 👨‍💻 Desarrolladores
- **Backend Team**: Arquitectura, Base de Datos
- **Frontend Team**: Interfaz de usuario, UX/UI
- **QA Team**: Testing, Validación, Documentación

### 📞 Contacto
- 📧 **Email**: rrios2023@alu.uct.cl
- 🌐 **Universidad**: [Universidad Católica de Temuco](https://www.uct.cl)
- 📚 **Curso**: Proyecto de Integración II

---

## 🔗 Enlaces

### 📋 Gestión de Proyecto
- [📋 **Backlog**](https://www.notion.so/Gesti-n-Docente-UCT-GDU-25bca7fc8b6f80d49880e67f7b985edb?source=copy_link) - Notion Board
- [📁 **Drive**](https://drive.google.com/drive/folders/1r1rkUVznRMGfj4wYYARBF_iQPvK_hOJ6?usp=sharing) - Documentos compartidos
- [📁 **BD**](https://supabase.com/dashboard/project/xsjbyoanshfdobndkdmw/editor/17308?schema=public )- BD compartida como server

### 🛠️ Herramientas de Desarrollo
- [📊 **Diagrama MER**](https://www.mermaidchart.com/app/projects/bd96d597-d74a-46ab-898d-4e1683352121/diagrams/a9fbfefb-fe41-4325-93e9-fb365b497c2f/version/v0.1/edit) - Mermaid Chart
- [🎨 **Diseño UI**](https://www.figma.com/design/ZLHl9yM5ypwcp0QV7pWRFb/Dise%C3%B1o-GDU?node-id=0-1&t=fO9DcDzrdC0ghbuk-0) - Figma

---

<div align="center">

### 🌟 ¡Gracias por tu interés en GestionDocenteUCT!

*Si encuentras útil este proyecto, no olvides darle una ⭐*

**Desarrollado con ❤️ para la comunidad educativa**

---

*Universidad Católica de Temuco - 2025*

</div>
