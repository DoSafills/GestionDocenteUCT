export type SalaTipo = 'aula' | 'laboratorio' | 'auditorio' | 'taller' | 'sala_conferencias';

export interface SalaDTO {
  id: number;
  codigo: string;
  capacidad: number;
  tipo: SalaTipo;
  disponible: boolean;
  equipamiento?: string | null;
  edificio_id: number;
}

export type SalaCreateDTO = Omit<SalaDTO, 'id'>;
