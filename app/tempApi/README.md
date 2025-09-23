# 🚀 API Temporal PHP para XAMPP - Estructura Real de BD

## **📋 Configuración basada en tu base de datos**

Según la imagen de tu base de datos, la tabla `docente` tiene estos campos:
- `docente_rut` (VARCHAR) - RUT del docente 
- `nombre` (VARCHAR) - Nombre completo
- `email` (VARCHAR) - Email único
- `pass_hash` (TEXT) - Hash de contraseña (MD5)
- `max_horas_docencia` (INT) - Máximo horas semanales

## **🛠️ Configuración XAMPP**

### 1. Preparar XAMPP:
```bash
# Copiar proyecto a XAMPP
C:\xampp\htdocs\GestionDocenteUCT\
```

### 2. Iniciar servicios:
- ✅ Apache (puerto 80)
- ✅ MySQL (puerto 3306)

### 3. Configurar automáticamente:
```
http://localhost/GestionDocenteUCT/app/tempApi/setup_mysql.php
```

## **🔗 URLs de la API**

| Endpoint | URL | Método | Descripción |
|----------|-----|--------|-------------|
| **Setup** | `/setup_mysql.php` | GET | Configuración inicial |
| **Test** | `/test.php` | GET | Verificar funcionamiento |
| **Docentes** | `/docentes.php` | GET/POST/PUT/DELETE | CRUD completo |
| **Login** | `/login/login.php` | POST | Autenticación |

## **📊 API de Docentes**

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

## **🔐 Autenticación**

### Login:
```javascript
fetch('http://localhost/GestionDocenteUCT/app/tempApi/login/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Para sessions
    body: JSON.stringify({
        email: 'ricardo.fuentes@uct.cl',
        password: 'ricardo123'
    })
});
```

## **⚡ Uso desde React**

### Importar la API:
```javascript
// Opción 1: Script tag en HTML
<script src="app/tempApi/conectar_frontend.js"></script>

// Opción 2: Import (si usas módulos)
import { DocentesAPI, useDocentes } from './app/tempApi/conectar_frontend.js';
```

### Hook de React:
```javascript
const DocentesComponent = () => {
    const { 
        docentes, 
        loading, 
        error, 
        crearDocente, 
        actualizarDocente, 
        eliminarDocente,
        buscarDocentes 
    } = useDocentes();

    const nuevoDocente = async () => {
        const exito = await crearDocente({
            docente_rut: '87.654.321-0',
            nombre: 'María González',
            email: 'maria@uct.cl',
            max_horas_docencia: 30
        });
        
        if (exito) {
            alert('Docente creado!');
        }
    };

    return (
        <div>
            <button onClick={nuevoDocente}>Crear Docente</button>
            <input onChange={e => buscarDocentes(e.target.value)} placeholder="Buscar..." />
            
            {loading && <p>Cargando...</p>}
            {error && <p>Error: {error}</p>}
            
            {docentes.map(docente => (
                <div key={docente.docente_rut}>
                    <strong>{docente.nombre}</strong> - {docente.email}
                    <button onClick={() => eliminarDocente(docente.docente_rut)}>
                        Eliminar
                    </button>
                </div>
            ))}
        </div>
    );
};
```

## **🧪 Datos de Prueba**

Credenciales incluidas automáticamente:

| Email | Password | Nombre | Horas |
|-------|----------|--------|-------|
| `ricardo.fuentes@uct.cl` | `ricardo123` | Ricardo Fuentes | 14 |
| `ana.torres@uct.cl` | `ana123` | Ana Torres | 5 |
| `carlos@uct.cl` | `carlos123` | Carlos López | 40 |
| `profe@uct.cl` | `profe123` | Profesor Ejemplo | 35 |

## **🔧 Troubleshooting**

### ❌ Error de conexión:
1. Verificar que XAMPP esté corriendo
2. Ir a: `http://localhost/GestionDocenteUCT/app/tempApi/test.php`
3. Revisar credenciales en `config.php`

### ❌ Error CORS:
- Ya está configurado para `localhost:5173` (Vite)
- Cambiar origen en `config.php` si usas otro puerto

### ❌ BD no existe:
1. Ir a: `setup_mysql.php`
2. Clic en "Configurar automáticamente"
3. Verificar en phpMyAdmin: `http://localhost/phpmyadmin`

### ❌ Error 500:
- Revisar logs PHP en: `C:\xampp\apache\logs\error.log`
- Activar debug en `config.php`

## **📈 Próximos Pasos**

1. **Verificar**: Ir a `test.php` para confirmar que todo funciona
2. **Probar API**: Usar `docentes.php` desde el navegador o Postman
3. **Conectar React**: Usar `conectar_frontend.js` en tu componente
4. **Desarrollar**: Agregar más funcionalidades según necesites

## **🔍 Validaciones Incluidas**

- ✅ RUT chileno con dígito verificador
- ✅ Email formato válido
- ✅ Campos obligatorios
- ✅ Duplicados (RUT y email únicos)
- ✅ SQL injection protection
- ✅ XSS protection

---

**¿Todo configurado?** ¡Perfecto! Ahora puedes conectar tu frontend React con la base de datos real usando XAMPP como puente. 🚀