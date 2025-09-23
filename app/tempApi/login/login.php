<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Incluir configuración compartida
require_once '../config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Recibir datos enviados como URL-encoded o JSON
    $email = $_POST["email"] ?? null;
    $password = $_POST["password"] ?? null;
    
    // Si no vienen por POST, intentar JSON
    if (!$email || !$password) {
        $input = json_decode(file_get_contents("php://input"), true);
        $email = $input["email"] ?? null;
        $password = $input["password"] ?? null;
    }

    if ($email && $password) {
        try {
            // Usar la conexión PostgreSQL configurada
            $sql = "SELECT pass_hash, nombre, docente_rut, max_horas_docencia FROM public.docente WHERE email = $1";
            $result = ejecutar_consulta($sql, [$email]);
            
            if (pg_num_rows($result) === 0) {
                respuesta_json(false, null, "Correo o contraseña incorrectos", 401);
                exit();
            }
            
            $docente = pg_fetch_assoc($result);

            if ($docente && $docente["pass_hash"] === md5($password)) {
                $_SESSION["usuario"] = $docente["nombre"];
                $_SESSION["rut"] = $docente["docente_rut"];
                $_SESSION["max_horas"] = $docente["max_horas_docencia"];

                // Retornar JSON a React
                respuesta_json(true, [
                    "usuario" => $docente["nombre"],
                    "rut" => $docente["docente_rut"],
                    "max_horas_docencia" => $docente["max_horas_docencia"]
                ], "Login exitoso");
                
            } else {
                respuesta_json(false, null, "Correo o contraseña incorrectos", 401);
            }
        } catch (Exception $e) {
            log_debug("Error en login: " . $e->getMessage());
            respuesta_json(false, null, "Error en el servidor", 500);
        }
    } else {
        respuesta_json(false, null, "Por favor complete todos los campos", 400);
    }
} else {
    respuesta_json(false, null, "Método no permitido", 405);
}
?>
