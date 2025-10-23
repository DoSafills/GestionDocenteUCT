export interface Restriccion {
  id: string | number;
  tipo: string;
  descripcion: string;
  prioridad: "alta" | "media" | "baja" | string;
  activa: boolean;
  fechaCreacion: string; // ISO o 'YYYY-MM-DD'
  creadoPor?: string;
  parametros?: Record<string, any>;
}
