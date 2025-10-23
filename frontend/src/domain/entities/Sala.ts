export interface Sala {
  id: string;
  nombre: string;
  tipo: string; // ej. 'laboratorio', 'aula'
  disponible: boolean;
  equipamiento: string[]; // ej. ['Proyector']
  capacidad?: number;
}
