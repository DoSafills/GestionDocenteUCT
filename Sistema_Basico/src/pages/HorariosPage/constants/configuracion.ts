export const DIAS_SEMANA = [
  { id: 'lunes', nombre: 'Lunes', nombreCorto: 'Lun', numero: 1 },
  { id: 'martes', nombre: 'Martes', nombreCorto: 'Mar', numero: 2 },
  { id: 'miércoles', nombre: 'Miércoles', nombreCorto: 'Mié', numero: 3 },
  { id: 'jueves', nombre: 'Jueves', nombreCorto: 'Jue', numero: 4 },
  { id: 'viernes', nombre: 'Viernes', nombreCorto: 'Vie', numero: 5 },
  { id: 'sábado', nombre: 'Sábado', nombreCorto: 'Sáb', numero: 6 },
];

export const ESTADOS_HORARIO = [
  { value: 'activo', label: 'Activo', color: 'bg-green-100 text-green-800' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  { value: 'reprogramado', label: 'Reprogramado', color: 'bg-yellow-100 text-yellow-800' }
];

export const HORAS_DIA = Array.from({ length: 15 }, (_, i) => {
  const hora = (i + 7).toString().padStart(2, '0');
  return `${hora}:00`;
});