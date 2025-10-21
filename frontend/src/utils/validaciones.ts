import type { Curso, Inscripcion, ValidacionResult } from '../types';


const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/; //Constantes para validación de tiempo "HH:MM"

export function validarInscripcion(curso: Curso, inscripcion: Inscripcion): ValidacionResult {
  const errores: string[] = [];
  const advertencias: string[] = [];

  // Validar cupos disponibles
  if (curso.cuposDisponibles <= 0) {
    errores.push('No hay cupos disponibles para este curso');
  }

  // Validar fecha de inscripción
  const fechaActual = new Date();
  const fechaLimite = new Date(curso.fechaFinInscripcion);
  if (fechaActual > fechaLimite) {
    errores.push('La fecha límite de inscripción ha pasado');
  }

  // Validar edad
  if (curso.restricciones.edadMinima && inscripcion.estudiante.edad < curso.restricciones.edadMinima) {
    errores.push(`Edad mínima requerida: ${curso.restricciones.edadMinima} años`);
  }

  if (curso.restricciones.edadMaxima && inscripcion.estudiante.edad > curso.restricciones.edadMaxima) {
    errores.push(`Edad máxima permitida: ${curso.restricciones.edadMaxima} años`);
  }

  // Validar prerrequisitos
  if (curso.restricciones.prerrequisitos && curso.restricciones.prerrequisitos.length > 0) {
    const prerequisitosFaltantes = curso.restricciones.prerrequisitos.filter(
      prereq => !inscripcion.estudiante.cursosCompletados.includes(prereq)
    );
    
    if (prerequisitosFaltantes.length > 0) {
      errores.push(`Prerrequisitos faltantes: ${prerequisitosFaltantes.join(', ')}`);
    }
  }

  // Validar nivel mínimo
  if (curso.restricciones.nivelMinimo) {
    const niveles = { 'Principiante': 1, 'Intermedio': 2, 'Avanzado': 3 };
    const nivelEstudiante = niveles[inscripcion.estudiante.nivel];
    const nivelRequerido = niveles[curso.restricciones.nivelMinimo];
    
    if (nivelEstudiante < nivelRequerido) {
      errores.push(`Nivel mínimo requerido: ${curso.restricciones.nivelMinimo}`);
    }
  }

  // Advertencias
  if (curso.cuposDisponibles <= 3 && curso.cuposDisponibles > 0) {
    advertencias.push('¡Últimos cupos disponibles! Inscríbete pronto.');
  }

  const fechaInicioLimite = new Date(fechaLimite);
  fechaInicioLimite.setDate(fechaInicioLimite.getDate() + 3);
  if (fechaActual > fechaInicioLimite) {
    advertencias.push('Las inscripciones cerrarán pronto');
  }

  return {
    esValida: errores.length === 0,
    errores,
    advertencias
  };
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function calcularProgreso(disponibles: number, total: number): number {
  return Math.round(((total - disponibles) / total) * 100);
}

/**
 *   ---===: Avance por Oscar Zapata :===---
 *   (Solo especificado para diferenciar de otras utilidades)

 * Estas funciones no tienen efectos secundarios y retornan booleanos o objetos
 * con errores para facilitar uso en UIs o en lógica de negocio.
 *
 * Nota: debajo de cada función se indica el repositorio/origen (ruta dentro del proyecto)
 *       y ejemplos de páginas donde podrían usarse (uso recomendado).
 */

export type Horario = {
  dia: string; // e.g. "Lunes"
  horaInicio: string; // "HH:MM"
  horaFin: string; // "HH:MM"
};

export type Franja = {
  inicio: string; // "HH:MM"
  fin: string; // "HH:MM"
};



/**
 * parseTimeToMinutes
 * - Propósito: Convertir "HH:MM" a minutos desde medianoche. Retorna null si formato inválido.
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: pages de horarios / programación (ej. HorariosPage, EdificiosPage para mostrar franjas)
 */
export const parseTimeToMinutes = (time: string): number | null => {
  const m = TIME_RE.exec(time);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  return hh * 60 + mm;
};

/**
 * isValidEmail
 * - Propósito: Validar formato básico de correo electrónico.
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: formularios de usuario / docentes (ej. forms de creación/edición de docentes)
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  // Regex simple, adecuado para validaciones de formulario (no exhaustiva)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

/**
 * isNonEmpty
 * - Propósito: Verificar que una cadena no sea vacía (ignora espacios).
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: validación general de campos obligatorios (formularios en pages/*)
 */
export const isNonEmpty = (value: string): boolean => {
  return value != null && value.trim().length > 0;
};

/**
 * validateFranjas
 * - Propósito: Validar una lista de franjas horarias.
 *   Comprueba formato "HH:MM", que inicio < fin y que no existan solapamientos.
 * - Retorna: { valid: boolean, errors: string[] }
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: componentes/servicios que gestionan franjas (ej. asignación de horarios a salas)
 */
export const validateFranjas = (franjas: Franja[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!Array.isArray(franjas)) {
    return { valid: false, errors: ["Entrada debe ser un arreglo de franjas"] };
  }
  const converted = franjas.map((f, idx) => {
    const inicio = parseTimeToMinutes(f.inicio);
    const fin = parseTimeToMinutes(f.fin);
    if (inicio === null) errors.push(`Franja[${idx}].inicio formato inválido (${f.inicio})`);
    if (fin === null) errors.push(`Franja[${idx}].fin formato inválido (${f.fin})`);
    if (inicio !== null && fin !== null && inicio >= fin) errors.push(`Franja[${idx}] inicio debe ser antes de fin`);
    return { idx, inicio, fin };
  });

  // revisar solapamientos: ordenar por inicio y comprobar fin del anterior <= inicio del siguiente
  const validConverted = converted.filter(c => c.inicio !== null && c.fin !== null) as { idx: number; inicio: number; fin: number }[];
  validConverted.sort((a, b) => a.inicio - b.inicio);
  for (let i = 1; i < validConverted.length; i++) {
    if (validConverted[i - 1].fin > validConverted[i].inicio) {
      errors.push(`Franja[${validConverted[i - 1].idx}] se solapa con Franja[${validConverted[i].idx}]`);
    }
  }

  return { valid: errors.length === 0, errors };
};

/**
 * validateHorarios
 * - Propósito: Validar un conjunto de horarios por día.
 *   Cada horario debe tener dia (no vacío), formato de horas correcto, inicio < fin,
 *   y no debe haber solapamientos dentro del mismo día.
 * - Retorna: { valid: boolean, errors: string[] }
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: páginas que crean/edita clases o asignaciones (ej. HorariosPage, ClaseForm)
 */
export const validateHorarios = (horarios: Horario[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!Array.isArray(horarios)) {
    return { valid: false, errors: ["Entrada debe ser un arreglo de horarios"] };
  }

  // Agrupar por día
  const byDay: Record<string, { inicio: number; fin: number; idx: number }[]> = {};

  horarios.forEach((h, idx) => {
    if (!h || typeof h !== "object") {
      errors.push(`Horario[${idx}] inválido`);
      return;
    }
    if (!isNonEmpty(h.dia)) {
      errors.push(`Horario[${idx}].dia es obligatorio`);
    }
    const inicio = parseTimeToMinutes(h.horaInicio);
    const fin = parseTimeToMinutes(h.horaFin);
    if (inicio === null) errors.push(`Horario[${idx}].horaInicio formato inválido (${h.horaInicio})`);
    if (fin === null) errors.push(`Horario[${idx}].horaFin formato inválido (${h.horaFin})`);
    if (inicio !== null && fin !== null && inicio >= fin) errors.push(`Horario[${idx}] inicio debe ser antes de fin`);
    if (inicio !== null && fin !== null && isNonEmpty(h.dia)) {
      const dayKey = h.dia.trim().toLowerCase();
      byDay[dayKey] = byDay[dayKey] || [];
      byDay[dayKey].push({ inicio, fin, idx });
    }
  });

  // Verificar solapamientos por día
  for (const [day, intervals] of Object.entries(byDay)) {
    intervals.sort((a, b) => a.inicio - b.inicio);
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i - 1].fin > intervals[i].inicio) {
        errors.push(`Solapamiento en ${day} entre Horario[${intervals[i - 1].idx}] y Horario[${intervals[i].idx}]`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
};

/**
 * WithValidation
 * - Propósito: "Decorador" funcional para envolver una función con una comprobación previa.
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: envolver handlers de formularios o funciones que consumen datos validados.
 *
 * Ejemplo:
 *   const guardarFranjas = (franjas: Franja[]) => { ... };
 *   const guardarFranjasSeguras = WithValidation(validateFranjas)(guardarFranjas);
 */
export function WithValidation<T extends any[], R>(
  validator: (...args: T) => boolean | { valid: boolean; errors?: string[] },
  messageOnFail?: string
) {
  return (fn: (...args: T) => R) =>
    (...args: T): R => {
      const res = validator(...args);
      const ok = typeof res === "boolean" ? res : res.valid;
      if (!ok) {
        const errors = typeof res === "boolean" ? [messageOnFail || "Validación fallida"] : (res.errors || [messageOnFail || "Validación fallida"]);
        throw new Error(errors.join("; "));
      }
      return fn(...args);
    };
}

/**
 * WithValidationAsync
 * - Propósito: Decorador para funciones async que deben ejecutar una validación previa (sincronía/asincronía).
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: handlers que llaman APIs o guardan datos en backend; permite validadores async.
 */
export function WithValidationAsync<T extends any[], R>(
  validator: (...args: T) => Promise<boolean | { valid: boolean; errors?: string[] }> | boolean | { valid: boolean; errors?: string[] },
  messageOnFail?: string
) {
  return (fn: (...args: T) => Promise<R> | R) =>
    async (...args: T): Promise<R> => {
      const resRaw = await Promise.resolve(validator(...args));
      const ok = typeof resRaw === "boolean" ? resRaw : resRaw.valid;
      if (!ok) {
        const errors = typeof resRaw === "boolean" ? [messageOnFail || "Validación fallida"] : (resRaw.errors || [messageOnFail || "Validación fallida"]);
        throw new Error(errors.join("; "));
      }
      return Promise.resolve(fn(...args));
    };
}

/**
 * composeValidators
 * - Propósito: Componer múltiples validadores en uno solo. Cada validador puede devolver boolean o {valid, errors}.
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: combinar reglas pequeñas (ej. requireFields + reglas de formato).
 */
export const composeValidators =
  <T extends any[]>(...validators: Array<(...args: T) => boolean | { valid: boolean; errors?: string[] }>) =>
  (...args: T): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    for (const v of validators) {
      const r = v(...args);
      if (typeof r === "boolean") {
        if (!r) errors.push("Validación fallida");
      } else if (!r.valid) {
        if (r.errors && r.errors.length) errors.push(...r.errors);
        else errors.push("Validación fallida");
      }
    }
    return { valid: errors.length === 0, errors };
  };

/**
 * requireFieldsValidator
 * - Propósito: Crear un validador que comprueba campos obligatorios no vacíos en un objeto.
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: validación genérica de formularios antes de enviar al backend.
 */
export const requireFieldsValidator =
  (fields: string[]) =>
  (obj: Record<string, any>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    for (const f of fields) {
      const val = obj?.[f];
      if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
        errors.push(`El campo '${f}' es obligatorio`);
      }
    }
    return { valid: errors.length === 0, errors };
  };

/* -------------------------
   Validaciones específicas para EdificiosPage (CREADO - no extraído)
   ------------------------- */

/**
 * EdificioForm / SalaForm - Tipos ligeros para validadores de formulario de página
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Nota: Estos validadores fueron CREADOS para EdificiosPage y no extraídos de otra parte.
 */
export type EdificioForm = {
  nombre: string;
  tipo: string;
  campus_id: number | string;
};

export type SalaForm = {
  codigo: string;
  capacidad: string | number;
  tipo: "aula" | "laboratorio" | "auditorio" | "sala_computacion";
  equipamiento?: string;
  esta_disponible?: boolean;
  edificio_id?: number | string;
};

/**
 * validateEdificioForm
 * - Propósito: Validar formulario de edificio (nombre, tipo, campus existente).
 * - Repositorio / Origen: CREADO para EdificiosPage (no extraído)
 * - Uso recomendado: EdificiosPage -> validar formularioEdificio antes de handleSubmitEdificio.
 */
export const validateEdificioForm =
  (campuses: { id: number; nombre?: string }[]) =>
  (form: EdificioForm): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!isNonEmpty(form.nombre)) errors.push("Nombre del edificio es obligatorio");
    if (!isNonEmpty(form.tipo)) errors.push("Tipo de edificio es obligatorio");
    const campusIdNum = Number(form.campus_id);
    if (!Number.isFinite(campusIdNum) || !campuses.some(c => c.id === campusIdNum)) {
      errors.push("Campus seleccionado inválido");
    }
    return { valid: errors.length === 0, errors };
  };

/**
 * validateSalaForm
 * - Propósito: Validar formulario de sala (codigo, capacidad, tipo, edificio).
 * - Repositorio / Origen: CREADO para EdificiosPage (no extraído)
 * - Uso recomendado: EdificiosPage -> validar formularioSala antes de handleSubmitSala.
 */
export const validateSalaForm =
  (allowedTypes: string[] = ["aula", "laboratorio", "auditorio", "sala_computacion"]) =>
  (form: SalaForm): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const codigoRe = /^[A-Za-z0-9-_]+$/;
    if (!isNonEmpty(String(form.codigo))) errors.push("Código de la sala es obligatorio");
    else if (!codigoRe.test(String(form.codigo))) errors.push("Código inválido (solo letras, números, guión y guión bajo)");
    const capacidadNum = Number(form.capacidad);
    if (!Number.isInteger(capacidadNum) || capacidadNum <= 0) errors.push("Capacidad debe ser un número entero mayor a 0");
    if (!allowedTypes.includes(form.tipo)) errors.push(`Tipo de sala inválido. Tipos permitidos: ${allowedTypes.join(", ")}`);
    if (form.edificio_id === undefined || form.edificio_id === null || String(form.edificio_id).trim() === "") {
      errors.push("Edificio asociado es obligatorio");
    }
    if (form.equipamiento && String(form.equipamiento).length > 500) errors.push("Equipamiento demasiado extenso (máx. 500 caracteres)");
    return { valid: errors.length === 0, errors };
  };

/**
 * validatePositiveInteger
 * - Propósito: Validador genérico para enteros positivos.
 * - Repositorio / Origen: c:\Users\Hank\Documents\GitHub\GestionDocenteUCT\frontend\src\utils\validaciones.ts
 * - Uso recomendado: campos numéricos en formularios (capacidad, cupos, etc).
 */
export const validatePositiveInteger = (value: any): { valid: boolean; errors: string[] } => {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return { valid: false, errors: ["Debe ser un número entero positivo"] };
  return { valid: true, errors: [] };
};