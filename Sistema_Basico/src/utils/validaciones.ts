import type { Curso, Inscripcion, ValidacionResult } from '../types';

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