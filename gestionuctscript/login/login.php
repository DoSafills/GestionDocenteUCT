<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Permitir peticiones desde React
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Conexión a PostgreSQL (Supabase exige SSL) (Rellenar las comillas con sus respectivos credenciales)
$host     = "";
$port     = "";
$user     = "";
$password = "";
$dbname   = "";

$conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password sslmode=require";
$db = pg_connect($conn_string);

if (!$db) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Recibir datos enviados como URL-encoded
    $email = $_POST["email"] ?? null;
    $password = $_POST["password"] ?? null;

    if ($email && $password) {
        // Consulta segura usando pg_query_params
        $sql = "SELECT pass_hash, nombre, docente_rut FROM public.docente WHERE email = $1";
        $result = pg_query_params($db, $sql, array($email));

        if (!$result) {
            echo json_encode(["success" => false, "message" => "Error al ejecutar la consulta."]);
            exit();
        }

        $docente = pg_fetch_assoc($result);

        if ($docente && $docente["pass_hash"] === md5($password)) {
            $_SESSION["usuario"] = $docente["nombre"];
            $_SESSION["rut"] = $docente["docente_rut"];

            // Retornar JSON a React
            echo json_encode([
                "success" => true,
                "usuario" => $docente["nombre"],
                "rut" => $docente["docente_rut"]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Por favor complete todos los campos."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>
