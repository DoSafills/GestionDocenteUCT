<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type"); 
header("Content-Type: application/json; charset=UTF-8");
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    $data = json_decode(file_get_contents("php://input"), true);

    $rut = $data["rut"] ?? null;
    $nombre = $data["nombre"] ?? null;
    $email = $data["email"] ?? null;
    $password = $data["password"] ?? null;
    $max_horas = $data["max_horas"] ?? null;

    if ($rut && $nombre && $email && $password) {
        $passwordHash = md5($password);

        if ($max_horas) {
            $sql = "INSERT INTO public.docente (docente_rut, nombre, email, pass_hash, max_horas_docencia) 
                    VALUES ($1, $2, $3, $4, $5)";
            $params = [$rut, $nombre, $email, $passwordHash, $max_horas];
        } else {
            $sql = "INSERT INTO public.docente (docente_rut, nombre, email, pass_hash) 
                    VALUES ($1, $2, $3, $4)";
            $params = [$rut, $nombre, $email, $passwordHash];
        }

        $result = pg_query_params($db, $sql, $params);

        if ($result) {
            echo json_encode(["success" => true, "message" => "Docente registrado correctamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar docente: " . pg_last_error($db)]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Por favor complete todos los campos obligatorios."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>
