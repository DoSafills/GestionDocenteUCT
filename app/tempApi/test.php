<?php
// Test para verificar conexión a Supabase PostgreSQL
require_once 'config.php';

echo "<h1>🧪 Test API Supabase - PostgreSQL</h1>";

// Función para mostrar resultado de test
function mostrar_test($nombre, $resultado, $detalle = '') {
    $icono = $resultado ? "✅" : "❌";
    $color = $resultado ? "green" : "red";
    echo "<p style='color: $color'>$icono <strong>$nombre:</strong> " . ($resultado ? "PASS" : "FAIL") . "</p>";
    if (!empty($detalle)) {
        echo "<div style='margin-left: 20px; color: #666;'>$detalle</div>";
    }
}

echo "<h2>🔧 Tests de Infraestructura</h2>";

// Test 1: Conexión a PostgreSQL
try {
    $conexion = conectar_bd();
    $db_info = DatabaseConfig::USE_TEST_DB ? "PostgreSQL Local (Test)" : "Supabase PostgreSQL";
    mostrar_test("Conexión a PostgreSQL", true, $db_info);
} catch (Exception $e) {
    mostrar_test("Conexión a PostgreSQL", false, $e->getMessage());
    
    echo "<div style='background: #fee; padding: 10px; margin: 10px 0; border-left: 4px solid #f44;'>";
    echo "<h3>🔧 Configuración necesaria:</h3>";
    
    if (DatabaseConfig::USE_TEST_DB) {
        echo "<p><strong>Para PostgreSQL Local:</strong></p>";
        echo "<ol>";
        echo "<li>Instalar PostgreSQL en tu máquina</li>";
        echo "<li>Crear base de datos: <code>gestion_docente_test</code></li>";
        echo "<li>Usuario: <code>postgres</code>, Password: <code>postgres</code></li>";
        echo "<li>Ejecutar el script de setup de la BD desde el proyecto Python</li>";
        echo "</ol>";
    } else {
        echo "<p><strong>Para Supabase:</strong></p>";
        echo "<ol>";
        echo "<li>Completa las credenciales en <code>config.php</code>:</li>";
        echo "<li>HOST: Tu URL de Supabase (ej: abc.supabase.co)</li>";
        echo "<li>USERNAME: Tu usuario de Supabase</li>";
        echo "<li>PASSWORD: Tu contraseña de Supabase</li>";
        echo "<li>DATABASE: Nombre de tu base de datos</li>";
        echo "<li>Cambia <code>USE_TEST_DB</code> a <code>false</code></li>";
        echo "</ol>";
    }
    echo "</div>";
    exit();
}

// Test 2: Verificar que existe la tabla docente
try {
    $sql_verificar_tabla = "SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'docente'
    )";
    
    $result = ejecutar_consulta($sql_verificar_tabla);
    $existe_tabla = pg_fetch_result($result, 0, 0) === 't';
    
    mostrar_test("Tabla 'docente' existe", $existe_tabla);
    
    if (!$existe_tabla) {
        echo "<div style='background: #fef7e0; padding: 10px; margin: 10px 0; border-left: 4px solid #f39c12;'>";
        echo "<p><strong>Solución:</strong></p>";
        echo "<ol>";
        echo "<li>Ejecutar el script setup de PostgreSQL del proyecto Python</li>";
        echo "<li>O crear la tabla manualmente con la estructura:</li>";
        echo "</ol>";
        echo "<pre style='background: #f8f9fa; padding: 10px;'>";
        echo "CREATE TABLE public.docente (
    docente_rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pass_hash TEXT NOT NULL,
    max_horas_docencia INTEGER DEFAULT 40
);</pre>";
        echo "</div>";
        exit();
    }
} catch (Exception $e) {
    mostrar_test("Verificar tabla", false, $e->getMessage());
    exit();
}

// Test 3: Verificar estructura de la tabla
try {
    $sql_estructura = "SELECT column_name, data_type, is_nullable 
                       FROM information_schema.columns 
                       WHERE table_schema = 'public' 
                       AND table_name = 'docente'
                       ORDER BY ordinal_position";
    
    $result = ejecutar_consulta($sql_estructura);
    $columnas = pg_fetch_all($result);
    
    $columnas_esperadas = ['docente_rut', 'nombre', 'email', 'pass_hash', 'max_horas_docencia'];
    $columnas_encontradas = array_column($columnas, 'column_name');
    
    $todas_columnas = true;
    foreach ($columnas_esperadas as $col) {
        if (!in_array($col, $columnas_encontradas)) {
            $todas_columnas = false;
            break;
        }
    }
    
    mostrar_test("Estructura de tabla correcta", $todas_columnas, 
                "Columnas: " . implode(", ", $columnas_encontradas));
    
    if ($todas_columnas) {
        echo "<h3>📋 Estructura de la tabla:</h3>";
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>Columna</th><th>Tipo</th><th>Nullable</th></tr>";
        foreach ($columnas as $col) {
            echo "<tr>";
            echo "<td>{$col['column_name']}</td>";
            echo "<td>{$col['data_type']}</td>";
            echo "<td>{$col['is_nullable']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
} catch (Exception $e) {
    mostrar_test("Verificar estructura", false, $e->getMessage());
}

// Test 4: Contar docentes
try {
    $sql_contar = "SELECT COUNT(*) as total FROM public.docente";
    $result = ejecutar_consulta($sql_contar);
    $total = pg_fetch_result($result, 0, 'total');
    
    mostrar_test("Datos en la tabla", $total > 0, "Total docentes: $total");
    
    if ($total > 0) {
        // Mostrar algunos docentes de ejemplo
        $sql_muestra = "SELECT docente_rut, nombre, email, max_horas_docencia FROM public.docente LIMIT 5";
        $result_muestra = ejecutar_consulta($sql_muestra);
        $docentes_muestra = pg_fetch_all($result_muestra);
        
        echo "<h3>📋 Muestra de docentes:</h3>";
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>RUT</th><th>Nombre</th><th>Email</th><th>Max Horas</th></tr>";
        foreach ($docentes_muestra as $docente) {
            echo "<tr>";
            echo "<td>{$docente['docente_rut']}</td>";
            echo "<td>{$docente['nombre']}</td>";
            echo "<td>{$docente['email']}</td>";
            echo "<td>{$docente['max_horas_docencia']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<div style='background: #e8f4fd; padding: 10px; margin: 10px 0; border-left: 4px solid #2196f3;'>";
        echo "<p><strong>Agregar datos de prueba:</strong></p>";
        echo "<pre style='background: #f8f9fa; padding: 10px;'>";
        echo "INSERT INTO public.docente (docente_rut, nombre, email, pass_hash, max_horas_docencia) VALUES
('12.345.678-9', 'Juan Pérez', 'juan@uct.cl', md5('123456'), 40),
('98.765.432-1', 'María González', 'maria@uct.cl', md5('123456'), 30);";
        echo "</pre>";
        echo "</div>";
    }
} catch (Exception $e) {
    mostrar_test("Contar docentes", false, $e->getMessage());
}

echo "<h2>🌐 Tests de API</h2>";

// Test 5: Probar endpoint GET de docentes
try {
    $url_docentes = "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . "/docentes.php";
    echo "<p><strong>URL API Docentes:</strong> <a href='$url_docentes' target='_blank'>$url_docentes</a></p>";
    
    // Test directo de la función
    $resultado_api = obtener_docentes('', 10, 0);
    $api_ok = isset($resultado_api['docentes']) && is_array($resultado_api['docentes']);
    
    mostrar_test("API GET /docentes.php", $api_ok, 
                $api_ok ? "Docentes encontrados: " . count($resultado_api['docentes']) : "Error en API");
    
} catch (Exception $e) {
    mostrar_test("API GET", false, $e->getMessage());
}

echo "<h2>🔍 Tests de Validación</h2>";

// Test 6: Validación de RUT
$ruts_test = [
    '12.345.678-5' => true,  // RUT válido
    '11.111.111-1' => true,  // RUT válido
    '12345678-K' => false,   // Formato incorrecto
    '99.999.999-9' => false, // RUT inválido
];

foreach ($ruts_test as $rut => $esperado) {
    $resultado = validar_rut($rut);
    mostrar_test("Validar RUT: $rut", $resultado === $esperado, 
                "Esperado: " . ($esperado ? "válido" : "inválido") . 
                ", Obtenido: " . ($resultado ? "válido" : "inválido"));
}

// Test 7: Validación de Email
$emails_test = [
    'test@uct.cl' => true,
    'invalid-email' => false,
    'user@example.com' => true,
    '@invalid.com' => false,
];

foreach ($emails_test as $email => $esperado) {
    $resultado = validar_email($email);
    mostrar_test("Validar Email: $email", $resultado === $esperado,
                "Esperado: " . ($esperado ? "válido" : "inválido") . 
                ", Obtenido: " . ($resultado ? "válido" : "inválido"));
}

echo "<h2>📊 Información del Sistema</h2>";

echo "<div style='background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff;'>";
echo "<strong>🔧 Configuración:</strong><br>";
echo "Servidor: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "PHP: " . phpversion() . "<br>";
echo "Host: " . $_SERVER['HTTP_HOST'] . "<br>";

if (DatabaseConfig::USE_TEST_DB) {
    echo "BD: " . DatabaseConfig::TEST_DATABASE . " (LOCAL)<br>";
    echo "Host BD: " . DatabaseConfig::TEST_HOST . "<br>";
} else {
    echo "BD: " . DatabaseConfig::DATABASE . " (SUPABASE)<br>";
    echo "Host BD: " . DatabaseConfig::HOST . "<br>";
}

echo "Debug habilitado: " . (DatabaseConfig::DEBUG_SQL ? "Sí" : "No") . "<br>";
echo "</div>";

echo "<h2>🚀 Siguientes Pasos</h2>";

if (DatabaseConfig::USE_TEST_DB) {
    echo "<div style='background: #fff3cd; padding: 10px; margin: 10px 0; border-left: 4px solid #ffc107;'>";
    echo "<h3>🔧 Configuración para Supabase:</h3>";
    echo "<ol>";
    echo "<li>Completa las credenciales de Supabase en <code>config.php</code></li>";
    echo "<li>Cambia <code>USE_TEST_DB</code> a <code>false</code></li>";
    echo "<li>Vuelve a ejecutar este test</li>";
    echo "</ol>";
    echo "</div>";
} else {
    echo "<p style='color: green; font-size: 18px;'><strong>✅ Configuración de Supabase completa!</strong></p>";
}

echo "<p><strong>URLs importantes:</strong></p>";
echo "<ul>";
echo "<li><a href='docentes.php'>API Docentes</a> - Endpoint principal</li>";
echo "<li><a href='login/login.php'>Login</a> - Autenticación</li>";
echo "</ul>";

echo "<h3>📋 Ejemplo de uso desde JavaScript:</h3>";
echo "<pre style='background: #f8f9fa; padding: 10px; border: 1px solid #ddd;'>";
echo "// Obtener docentes
fetch('$url_docentes')
  .then(response => response.json())
  .then(data => console.log(data));

// Login
fetch('" . dirname($url_docentes) . "/login/login.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@uct.cl',
    password: '123456'
  })
});";
echo "</pre>";
?>