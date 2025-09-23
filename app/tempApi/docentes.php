<?php
// API para gestión de docentes en Supabase PostgreSQL
// Basada en la estructura real: docente_rut, nombre, email, pass_hash, max_horas_docencia

require_once 'config.php';

// Función para obtener todos los docentes
function obtener_docentes($buscar = '', $limite = 50, $offset = 0) {
    try {
        $sql = "SELECT docente_rut, nombre, email, max_horas_docencia 
                FROM public.docente 
                WHERE 1=1";
        $params = [];
        $param_index = 1;
        
        // Filtro de búsqueda
        if (!empty($buscar)) {
            $sql .= " AND (nombre ILIKE $" . $param_index . " OR email ILIKE $" . ($param_index + 1) . " OR docente_rut ILIKE $" . ($param_index + 2) . ")";
            $buscar_param = "%$buscar%";
            $params[] = $buscar_param;
            $params[] = $buscar_param;
            $params[] = $buscar_param;
            $param_index += 3;
        }
        
        $sql .= " ORDER BY nombre ASC LIMIT $" . $param_index . " OFFSET $" . ($param_index + 1);
        $params[] = $limite;
        $params[] = $offset;
        
        log_debug("Ejecutando consulta: $sql");
        
        $result = ejecutar_consulta($sql, $params);
        $docentes = pg_fetch_all($result) ?: [];
        
        // Contar total
        $sql_count = "SELECT COUNT(*) as total FROM public.docente WHERE 1=1";
        $params_count = [];
        
        if (!empty($buscar)) {
            $sql_count .= " AND (nombre ILIKE $1 OR email ILIKE $2 OR docente_rut ILIKE $3)";
            $params_count = [$buscar_param, $buscar_param, $buscar_param];
        }
        
        $result_count = ejecutar_consulta($sql_count, $params_count);
        $total = pg_fetch_result($result_count, 0, 'total');
        
        log_debug("Docentes encontrados: " . count($docentes));
        
        return [
            'docentes' => $docentes,
            'total' => intval($total),
            'limite' => $limite,
            'offset' => $offset
        ];
        
    } catch (Exception $e) {
        log_debug("Error en obtener_docentes: " . $e->getMessage());
        throw $e;
    }
}

// Función para crear un nuevo docente
function crear_docente($datos) {
    try {
        // Validaciones
        if (empty($datos['docente_rut']) || !validar_rut($datos['docente_rut'])) {
            throw new Exception("RUT inválido");
        }
        
        if (empty($datos['nombre'])) {
            throw new Exception("Nombre es requerido");
        }
        
        if (empty($datos['email']) || !validar_email($datos['email'])) {
            throw new Exception("Email inválido");
        }
        
        // Verificar si ya existe
        $sql_verificar = "SELECT docente_rut FROM public.docente WHERE docente_rut = $1 OR email = $2";
        $result_verificar = ejecutar_consulta($sql_verificar, [$datos['docente_rut'], $datos['email']]);
        
        if (pg_num_rows($result_verificar) > 0) {
            throw new Exception("Ya existe un docente con ese RUT o email");
        }
        
        // Crear password hash si se proporciona, sino usar uno por defecto
        $password_hash = isset($datos['password']) ? md5($datos['password']) : md5('123456');
        
        // Insertar nuevo docente
        $sql = "INSERT INTO public.docente (docente_rut, nombre, email, pass_hash, max_horas_docencia) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING docente_rut, nombre, email, max_horas_docencia";
        
        $params = [
            $datos['docente_rut'],
            $datos['nombre'],
            $datos['email'],
            $password_hash,
            isset($datos['max_horas_docencia']) ? intval($datos['max_horas_docencia']) : 40
        ];
        
        log_debug("Creando docente: " . $datos['docente_rut']);
        
        $result = ejecutar_consulta($sql, $params);
        $docente_creado = pg_fetch_assoc($result);
        
        log_debug("Docente creado exitosamente");
        
        return $docente_creado;
        
    } catch (Exception $e) {
        log_debug("Error en crear_docente: " . $e->getMessage());
        throw $e;
    }
}

// Función para actualizar un docente
function actualizar_docente($rut, $datos) {
    try {
        // Verificar que existe
        $sql_verificar = "SELECT docente_rut FROM public.docente WHERE docente_rut = $1";
        $result_verificar = ejecutar_consulta($sql_verificar, [$rut]);
        
        if (pg_num_rows($result_verificar) === 0) {
            throw new Exception("Docente no encontrado");
        }
        
        $campos_actualizar = [];
        $params = [];
        $param_index = 1;
        
        if (isset($datos['nombre']) && !empty($datos['nombre'])) {
            $campos_actualizar[] = "nombre = $" . $param_index;
            $params[] = $datos['nombre'];
            $param_index++;
        }
        
        if (isset($datos['email']) && !empty($datos['email'])) {
            if (!validar_email($datos['email'])) {
                throw new Exception("Email inválido");
            }
            $campos_actualizar[] = "email = $" . $param_index;
            $params[] = $datos['email'];
            $param_index++;
        }
        
        if (isset($datos['max_horas_docencia'])) {
            $campos_actualizar[] = "max_horas_docencia = $" . $param_index;
            $params[] = intval($datos['max_horas_docencia']);
            $param_index++;
        }
        
        if (isset($datos['password']) && !empty($datos['password'])) {
            $campos_actualizar[] = "pass_hash = $" . $param_index;
            $params[] = md5($datos['password']);
            $param_index++;
        }
        
        if (empty($campos_actualizar)) {
            throw new Exception("No hay campos para actualizar");
        }
        
        $sql = "UPDATE public.docente SET " . implode(", ", $campos_actualizar) . " WHERE docente_rut = $" . $param_index;
        $params[] = $rut;
        
        log_debug("Actualizando docente: $rut");
        
        ejecutar_consulta($sql, $params);
        
        log_debug("Docente actualizado exitosamente");
        
        return true;
        
    } catch (Exception $e) {
        log_debug("Error en actualizar_docente: " . $e->getMessage());
        throw $e;
    }
}

// Función para eliminar un docente
function eliminar_docente($rut) {
    try {
        $sql = "DELETE FROM public.docente WHERE docente_rut = $1";
        $result = ejecutar_consulta($sql, [$rut]);
        
        if (pg_affected_rows($result) === 0) {
            throw new Exception("Docente no encontrado");
        }
        
        log_debug("Docente eliminado: $rut");
        
        return true;
        
    } catch (Exception $e) {
        log_debug("Error en eliminar_docente: " . $e->getMessage());
        throw $e;
    }
}

// Manejar las peticiones HTTP
try {
    $metodo = $_SERVER['REQUEST_METHOD'];
    
    switch ($metodo) {
        case 'GET':
            $buscar = $_GET['buscar'] ?? '';
            $limite = intval($_GET['limite'] ?? 50);
            $offset = intval($_GET['offset'] ?? 0);
            
            $resultado = obtener_docentes($buscar, $limite, $offset);
            respuesta_json(true, $resultado, 'Docentes obtenidos correctamente');
            break;
            
        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);
            
            if (!$datos) {
                throw new Exception("Datos inválidos");
            }
            
            $datos = limpiar_input($datos);
            $docente = crear_docente($datos);
            
            respuesta_json(true, $docente, 'Docente creado correctamente', 201);
            break;
            
        case 'PUT':
            $rut = $_GET['rut'] ?? null;
            
            if (!$rut) {
                throw new Exception("RUT es requerido para actualizar");
            }
            
            $datos = json_decode(file_get_contents('php://input'), true);
            
            if (!$datos) {
                throw new Exception("Datos inválidos");
            }
            
            $datos = limpiar_input($datos);
            actualizar_docente($rut, $datos);
            
            respuesta_json(true, null, 'Docente actualizado correctamente');
            break;
            
        case 'DELETE':
            $rut = $_GET['rut'] ?? null;
            
            if (!$rut) {
                throw new Exception("RUT es requerido para eliminar");
            }
            
            eliminar_docente($rut);
            
            respuesta_json(true, null, 'Docente eliminado correctamente');
            break;
            
        default:
            throw new Exception("Método no permitido");
    }
    
} catch (Exception $e) {
    log_debug("Error en API: " . $e->getMessage());
    respuesta_json(false, null, $e->getMessage(), 400);
}
?>