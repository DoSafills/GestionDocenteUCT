<?php
// Configuración para Supabase PostgreSQL
// Basada en las credenciales de test del proyecto principal

// Headers CORS para desarrollo local
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de base de datos Supabase PostgreSQL
// Usando las credenciales de test del proyecto (de settings.py)
class DatabaseConfig {
    // Credenciales Supabase - Completar con tus datos
    const HOST = '';                    // Tu host de Supabase (ej: abc.supabase.co)
    const PORT = '5432';               // Puerto PostgreSQL 
    const USERNAME = '';               // Usuario de tu proyecto Supabase
    const PASSWORD = '';               // Password de tu proyecto Supabase
    const DATABASE = '';               // Nombre de tu base de datos
    
    // Para desarrollo local, usar las credenciales de test
    const TEST_HOST = 'localhost';
    const TEST_PORT = '5432';
    const TEST_USERNAME = 'postgres';
    const TEST_PASSWORD = 'postgres';
    const TEST_DATABASE = 'gestion_docente_test';
    
    // Configuración de desarrollo
    const DEBUG_SQL = true;
    const ENVIRONMENT = 'development';
    const USE_TEST_DB = true;  // Cambiar a false para usar Supabase en producción
}

// Función para conectar a PostgreSQL (Supabase o local)
function conectar_bd() {
    try {
        if (DatabaseConfig::USE_TEST_DB) {
            // Conexión a PostgreSQL local para tests
            $conn_string = sprintf(
                "host=%s port=%s dbname=%s user=%s password=%s",
                DatabaseConfig::TEST_HOST,
                DatabaseConfig::TEST_PORT,
                DatabaseConfig::TEST_DATABASE,
                DatabaseConfig::TEST_USERNAME,
                DatabaseConfig::TEST_PASSWORD
            );
        } else {
            // Conexión a Supabase PostgreSQL
            $conn_string = sprintf(
                "host=%s port=%s dbname=%s user=%s password=%s sslmode=require",
                DatabaseConfig::HOST,
                DatabaseConfig::PORT,
                DatabaseConfig::DATABASE,
                DatabaseConfig::USERNAME,
                DatabaseConfig::PASSWORD
            );
        }
        
        $db = pg_connect($conn_string);
        
        if (!$db) {
            throw new Exception("No se pudo conectar a PostgreSQL");
        }
        
        if (DatabaseConfig::DEBUG_SQL) {
            $db_name = DatabaseConfig::USE_TEST_DB ? DatabaseConfig::TEST_DATABASE : DatabaseConfig::DATABASE;
            error_log("✅ Conexión exitosa a PostgreSQL: " . $db_name);
        }
        
        return $db;
        
    } catch (Exception $e) {
        if (DatabaseConfig::DEBUG_SQL) {
            error_log("❌ Error de conexión PostgreSQL: " . $e->getMessage());
        }
        throw new Exception("Error de conexión a la base de datos: " . $e->getMessage());
    }
}

// Función para respuesta JSON consistente
function respuesta_json($ok = true, $datos = null, $mensaje = '', $codigo_http = 200) {
    http_response_code($codigo_http);
    header('Content-Type: application/json; charset=utf-8');
    
    $respuesta = [
        'ok' => $ok,
        'mensaje' => $mensaje,
        'timestamp' => date('c'),
        'ambiente' => DatabaseConfig::ENVIRONMENT
    ];
    
    if ($datos !== null) {
        $respuesta['data'] = $datos;
    }
    
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

// Función para validar RUT chileno
function validar_rut($rut) {
    if (empty($rut)) return false;
    
    // Limpiar formato
    $rut = preg_replace('/[^0-9kK]/', '', strtoupper($rut));
    
    if (strlen($rut) < 8 || strlen($rut) > 9) return false;
    
    $dv = substr($rut, -1);
    $numero = substr($rut, 0, -1);
    
    // Calcular dígito verificador
    $suma = 0;
    $multiplicador = 2;
    
    for ($i = strlen($numero) - 1; $i >= 0; $i--) {
        $suma += intval($numero[$i]) * $multiplicador;
        $multiplicador = $multiplicador == 7 ? 2 : $multiplicador + 1;
    }
    
    $resto = $suma % 11;
    $dv_calculado = $resto == 0 ? '0' : ($resto == 1 ? 'K' : strval(11 - $resto));
    
    return $dv === $dv_calculado;
}

// Función para validar email
function validar_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Función para limpiar input
function limpiar_input($data) {
    if (is_array($data)) {
        return array_map('limpiar_input', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Función para ejecutar consulta PostgreSQL segura
function ejecutar_consulta($consulta, $parametros = []) {
    $db = conectar_bd();
    
    if (empty($parametros)) {
        $result = pg_query($db, $consulta);
    } else {
        $result = pg_query_params($db, $consulta, $parametros);
    }
    
    if (!$result) {
        throw new Exception("Error en consulta SQL: " . pg_last_error($db));
    }
    
    return $result;
}

// Log para debugging
function log_debug($mensaje) {
    if (DatabaseConfig::DEBUG_SQL) {
        error_log("[API DEBUG] " . $mensaje);
    }
}

// Información de la configuración
$db_info = DatabaseConfig::USE_TEST_DB ? 
    DatabaseConfig::TEST_DATABASE . " (LOCAL)" : 
    DatabaseConfig::DATABASE . " (SUPABASE)";
log_debug("Configuración cargada - BD: " . $db_info);
?>