# 🎯 Configuración Rápida - Supabase PostgreSQL

## **⚡ Para empezar AHORA**

### 1. Ve a Supabase y obtén tus credenciales:
- Proyecto URL: `https://tu-proyecto.supabase.co`
- Contraseña de PostgreSQL: `tu-password`

### 2. Edita `config.php` líneas 22-27:
```php
const HOST = 'db.tu-proyecto.supabase.co';  // ← Cambiar aquí
const USERNAME = 'postgres';
const PASSWORD = 'tu-password-aqui';        // ← Cambiar aquí  
const DATABASE = 'postgres';
const PORT = 5432;
const USE_TEST_DB = false;                  // ← false para Supabase
```

### 3. Prueba la conexión:
```
http://localhost/GestionDocenteUCT/app/tempApi/test.php
```

### 4. Si funciona, prueba la API:
```
http://localhost/GestionDocenteUCT/app/tempApi/docentes.php
```

---

## **🔍 Solución rápida de problemas**

### ❌ No conecta a Supabase:
1. Verifica el HOST: debe ser `db.tu-proyecto.supabase.co`
2. La contraseña debe ser la de PostgreSQL (no la de tu cuenta)
3. Puerto debe ser `5432`

### ❌ Tabla no existe:
Crea la tabla en Supabase:
```sql
CREATE TABLE public.docente (
    docente_rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pass_hash TEXT NOT NULL,
    max_horas_docencia INTEGER DEFAULT 40
);
```

### ❌ Error CORS desde React:
Ya está configurado para `localhost:5173`

---

## **✅ Una vez que funcione:**

1. **Crear docente de prueba** desde React:
```javascript
const api = new DocentesSupabaseAPI();
await api.crearDocente({
    docente_rut: '12.345.678-9',
    nombre: 'Juan Pérez',
    email: 'juan@uct.cl',
    max_horas_docencia: 40
});
```

2. **Login de prueba:**
```javascript
const resultado = await api.login('juan@uct.cl', '123456');
```

3. **Integrar en tu componente React:**
```javascript
const { docentes, loading } = useDocentesSupabase();
```

---

**¿Todo listo?** → Ver [README_SUPABASE.md](README_SUPABASE.md) para detalles completos