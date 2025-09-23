<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$origin = "http://localhost:5173";
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Vary: Origin");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$host     = "aws-1-us-east-1.pooler.supabase.com";
$port     = "6543";
$user     = "postgres.xsjbyoanshfdobndkdmw";
$password = "169581105Tm";
$dbname   = "postgres";

$conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password sslmode=require";
$db = pg_connect($conn_string);
if (!$db) {
  http_response_code(500);
  echo json_encode(["ok" => false, "message" => "Error de conexión a la base de datos"]);
  exit;
}

function limpiar($v) { return htmlspecialchars(trim((string)$v), ENT_QUOTES, 'UTF-8'); }

$action = $_REQUEST['action'] ?? null;
if ($action === null) $action = filter_input(INPUT_GET, 'action');
if ($action === null) $action = filter_input(INPUT_POST, 'action');
$action = strtolower(trim((string)$action));

if ($action === '' && $_SERVER['REQUEST_METHOD'] === 'GET') {
  $action = 'list';
}

if (isset($_GET['__debug'])) {
  echo json_encode([
    "ok" => true,
    "debug" => [
      "method" => $_SERVER["REQUEST_METHOD"] ?? null,
      "query_string" => $_SERVER["QUERY_STRING"] ?? null,
      "action" => $action,
      "_GET" => $_GET,
      "_POST" => $_POST,
    ]
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($action === 'list') {
  $sql = "SELECT docente_rut, nombre, email, pass_hash, max_horas_docencia
          FROM docente
          ORDER BY nombre ASC";
  $res = pg_query($db, $sql);
  if ($res === false) {
    echo json_encode(["ok" => false, "message" => pg_last_error($db)]);
    exit;
  }
  $rows = pg_fetch_all($res);
  echo json_encode(["ok" => true, "data" => $rows ?: []]);
  exit;
}

if ($action === 'create') {
  $rut   = limpiar($_POST["docente_rut"] ?? "");
  $nom   = limpiar($_POST["nombre"] ?? "");
  $email = limpiar($_POST["email"] ?? "");
  $pass  = (string)($_POST["pass_hash"] ?? "");
  $max   = (int)($_POST["max_horas_docencia"] ?? 0);

  if (!$rut || !$nom || !$email) {
    echo json_encode(["ok" => false, "message" => "Faltan campos obligatorios"]);
    exit;
  }

  if ($pass && strlen($pass) < 60) {
    $pass = password_hash($pass, PASSWORD_BCRYPT);
  }

  $sql = "INSERT INTO docente (docente_rut, nombre, email, pass_hash, max_horas_docencia)
          VALUES ($1, $2, $3, $4, $5)";
  $res = pg_query_params($db, $sql, [$rut, $nom, $email, $pass, $max]);

  if ($res) {
    echo json_encode(["ok" => true, "data" => [
      "docente_rut" => $rut,
      "nombre" => $nom,
      "email" => $email,
      "pass_hash" => $pass,
      "max_horas_docencia" => $max
    ]]);
  } else {
    echo json_encode(["ok" => false, "message" => pg_last_error($db)]);
  }
  exit;
}

if ($action === 'update') {
  $rut   = limpiar($_POST["docente_rut"] ?? "");
  $nom   = limpiar($_POST["nombre"] ?? "");
  $email = limpiar($_POST["email"] ?? "");
  $pass  = (string)($_POST["pass_hash"] ?? "");
  $max   = (int)($_POST["max_horas_docencia"] ?? 0);

  if (!$rut) {
    echo json_encode(["ok" => false, "message" => "RUT requerido"]);
    exit;
  }

  if ($pass !== "" && strlen($pass) < 60) {
    $pass = password_hash($pass, PASSWORD_BCRYPT);
  }

  if ($pass === "") {
    $sql = "UPDATE docente SET nombre=$2, email=$3, max_horas_docencia=$4 WHERE docente_rut=$1";
    $params = [$rut, $nom, $email, $max];
  } else {
    $sql = "UPDATE docente SET nombre=$2, email=$3, pass_hash=$4, max_horas_docencia=$5 WHERE docente_rut=$1";
    $params = [$rut, $nom, $email, $pass, $max];
  }

  $res = pg_query_params($db, $sql, $params);

  if ($res) {
    echo json_encode(["ok" => true, "data" => [
      "docente_rut" => $rut,
      "nombre" => $nom,
      "email" => $email,
      "pass_hash" => ($pass === "" ? null : $pass),
      "max_horas_docencia" => $max
    ]]);
  } else {
    echo json_encode(["ok" => false, "message" => pg_last_error($db)]);
  }
  exit;
}

if ($action === 'delete') {
  $rut = limpiar($_POST["id"] ?? $_GET["id"] ?? "");
  if (!$rut) {
    echo json_encode(["ok" => false, "message" => "RUT requerido"]);
    exit;
  }

  $sql = "DELETE FROM docente WHERE docente_rut=$1";
  $res = pg_query_params($db, $sql, [$rut]);

  if ($res) {
    echo json_encode(["ok" => true]);
  } else {
    echo json_encode(["ok" => false, "message" => pg_last_error($db)]);
  }
  exit;
}

echo json_encode([
  "ok" => false,
  "message" => "Acción no válida",
  "debug_action" => $action,
], JSON_UNESCAPED_UNICODE);
exit;
