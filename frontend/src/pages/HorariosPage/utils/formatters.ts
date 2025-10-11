export const formatearHora = (hora: string): string => {
  return hora.slice(0, 5); // Retorna HH:MM
};

export const formatearDia = (diaNumero: number): string => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[diaNumero] || 'Día desconocido';
};

export const formatearRangoHorario = (inicio: string, fin: string): string => {
  return `${formatearHora(inicio)} - ${formatearHora(fin)}`;
};

export const formatearNombreCompleto = (nombre: string, apellido?: string): string => {
  return apellido ? `${nombre} ${apellido}` : nombre;
};