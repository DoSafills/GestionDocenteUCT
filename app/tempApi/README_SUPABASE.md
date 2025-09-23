# 🚀 API Temporal PHP para Supabase PostgreSQL

## **📋 Configuración basada en tu base de datos**

Esta API está configurada para conectarse a **Supabase PostgreSQL** y usar la estructura real de tu tabla `docente`:

- `docente_rut` (VARCHAR) - RUT del docente (clave primaria)
- `nombre` (VARCHAR) - Nombre completo
- `email` (VARCHAR) - Email único
- `pass_hash` (TEXT) - Hash de contraseña (MD5)
- `max_horas_docencia` (INT) - Máximo horas semanales

## **🔧 Configuración de Supabase**

### 1. Completar credenciales en `config.php`:

```php
// En la clase DatabaseConfig
const HOST = 'tu-proyecto.supabase.co';     // Tu host de Supabase
const USERNAME = 'postgres';                 // Usuario de Supabase
const PASSWORD = 'tu-password-supabase';     // Tu contraseña
const DATABASE = 'postgres';                 // Nombre de la BD (generalmente 'postgres')

// Cambiar a producción
const USE_TEST_DB = false;  // false para usar Supabase
```

### 2. Para desarrollo local (PostgreSQL):

Si prefieres probar primero con PostgreSQL local:

```php
const USE_TEST_DB = true;   // true para PostgreSQL local
```

Requisitos:
- PostgreSQL instalado localmente
- Base de datos: `gestion_docente_test`
- Usuario: `postgres`, Password: `postgres`

## **🌐 URLs de la API**

| Endpoint | URL | Método | Descripción |
|----------|-----|--------|-------------|
| **Test** | `/test.php` | GET | Verificar conexión a Supabase |
| **Docentes** | `/docentes.php` | GET/POST/PUT/DELETE | CRUD completo |
| **Login** | `/login/login.php` | POST | Autenticación |

## **📊 API de Docentes con Supabase**

### GET - Obtener docentes:
```javascript
// Todos los docentes
fetch('http://localhost/GestionDocenteUCT/app/tempApi/docentes.php')

// Con filtros
fetch('http://localhost/GestionDocenteUCT/app/tempApi/docentes.php?buscar=Ricardo&limite=10')
```

### POST - Crear docente:
```javascript
fetch('http://localhost/GestionDocenteUCT/app/tempApi/docentes.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        docente_rut: '12.345.678-9',
        nombre: 'Juan Pérez',
        email: 'juan@uct.cl',
        max_horas_docencia: 40,
        password: 'clave123' // Opcional, por defecto: 123456
    })
});
```

### PUT - Actualizar docente:
```javascript
fetch('http://localhost/GestionDocenteUCT/app/tempApi/docentes.php?rut=12.345.678-9', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nombre: 'Juan Carlos Pérez',
        max_horas_docencia: 35
    })
});
```

### DELETE - Eliminar docente:
```javascript
fetch('http://localhost/GestionDocenteUCT/app/tempApi/docentes.php?rut=12.345.678-9', {
    method: 'DELETE'
});
```

## **🔐 Autenticación con Supabase**

### Login:
```javascript
fetch('http://localhost/GestionDocenteUCT/app/tempApi/login/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Para sessions
    body: JSON.stringify({
        email: 'test@uct.cl',
        password: '123456'
    })
});
```

## **⚡ Uso desde React**

### Importar la API:
```javascript
// Opción 1: Script tag en HTML
<script src="app/tempApi/conectar_frontend.js"></script>

// Opción 2: Import (si usas módulos)
import { DocentesSupabaseAPI, useDocentesSupabase } from './app/tempApi/conectar_frontend.js';
```

### Hook de React especializado para Supabase:
```javascript
const DocentesComponent = () => {
    const { 
        docentes, 
        loading, 
        error, 
        totalDocentes,
        crearDocente, 
        actualizarDocente, 
        eliminarDocente,
        buscarDocentes,
        siguientePagina,
        paginaAnterior 
    } = useDocentesSupabase();

    const nuevoDocente = async () => {
        const exito = await crearDocente({
            docente_rut: '87.654.321-0',
            nombre: 'María González',
            email: 'maria@uct.cl',
            max_horas_docencia: 30
        });
        
        if (exito) {
            alert('Docente creado en Supabase!');
        }
    };

    return (
        <div>
            <h1>Docentes en Supabase ({totalDocentes})</h1>
            <button onClick={nuevoDocente}>Crear Docente</button>
            <input onChange={e => buscarDocentes(e.target.value)} placeholder="Buscar..." />
            
            {loading && <p>⏳ Cargando desde Supabase...</p>}
            {error && <p>❌ Error: {error}</p>}
            
            {docentes.map(docente => (
                <div key={docente.docente_rut}>
                    <strong>{docente.nombre}</strong> - {docente.email}
                    <button onClick={() => eliminarDocente(docente.docente_rut)}>
                        Eliminar
                    </button>
                </div>
            ))}
            
            <button onClick={paginaAnterior}>← Anterior</button>
            <button onClick={siguientePagina}>Siguiente →</button>
        </div>
    );
};
```

## **🧪 Testing y Desarrollo**

### 1. Verificar conexión:
```
http://localhost/GestionDocenteUCT/app/tempApi/test.php
```

### 2. Probar API directamente:
```
http://localhost/GestionDocenteUCT/app/tempApi/docentes.php
```

### 3. Test de login:
```javascript
const api = new DocentesSupabaseAPI();
const user = await api.login('test@uct.cl', '123456');
```

## **🔧 Troubleshooting**

### ❌ Error de conexión a Supabase:
1. Verificar credenciales en `config.php`
2. Confirmar que Supabase está activo
3. Verificar SSL (Supabase requiere `sslmode=require`)

### ❌ Tabla no existe:
1. Ejecutar el setup de BD desde el proyecto Python principal
2. O crear la tabla manualmente:
```sql
CREATE TABLE public.docente (
    docente_rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pass_hash TEXT NOT NULL,
    max_horas_docencia INTEGER DEFAULT 40
);
```

### ❌ Error CORS:
- Ya está configurado para `localhost:5173` (Vite)
- Cambiar origen en `config.php` si usas otro puerto

### ❌ Error de permisos en Supabase:
- Verificar que el usuario tiene permisos de lectura/escritura
- Revisar Row Level Security (RLS) si está habilitado

## **📈 Ventajas de usar Supabase**

✅ **Escalabilidad**: Base de datos en la nube, fácil de escalar  
✅ **Backup automático**: Supabase maneja respaldos automáticamente  
✅ **SSL por defecto**: Conexiones seguras automáticas  
✅ **Panel de administración**: Interface web para gestionar datos  
✅ **API REST automática**: Supabase genera API REST automáticamente  
✅ **Real-time**: Capacidades de tiempo real nativas  

## **🔍 Validaciones Incluidas**

- ✅ RUT chileno con dígito verificador
- ✅ Email formato válido
- ✅ Campos obligatorios
- ✅ Duplicados (RUT y email únicos)
- ✅ SQL injection protection (pg_query_params)
- ✅ XSS protection
- ✅ Conexión SSL a Supabase

---

**¿Todo configurado?** ¡Perfecto! Ahora puedes conectar tu frontend React con Supabase PostgreSQL de forma segura y escalable. 🚀