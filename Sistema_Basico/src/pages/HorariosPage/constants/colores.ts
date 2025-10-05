export const COLORES_HORARIO = [
  { value: '#3B82F6', label: 'Azul', clase: 'bg-blue-500' },
  { value: '#10B981', label: 'Verde', clase: 'bg-green-500' },
  { value: '#F59E0B', label: 'Amarillo', clase: 'bg-yellow-500' },
  { value: '#EF4444', label: 'Rojo', clase: 'bg-red-500' },
  { value: '#8B5CF6', label: 'Púrpura', clase: 'bg-purple-500' },
  { value: '#06B6D4', label: 'Cyan', clase: 'bg-cyan-500' },
  { value: '#84CC16', label: 'Lima', clase: 'bg-lime-500' },
  { value: '#F97316', label: 'Naranja', clase: 'bg-orange-500' },
  { value: '#EC4899', label: 'Rosa', clase: 'bg-pink-500' },
  { value: '#6B7280', label: 'Gris', clase: 'bg-gray-500' }
];

export const getColorPorEstado = (estado: string) => {
  switch (estado) {
    case 'activo': return 'bg-green-100 text-green-800';
    case 'cancelado': return 'bg-red-100 text-red-800';
    case 'reprogramado': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};