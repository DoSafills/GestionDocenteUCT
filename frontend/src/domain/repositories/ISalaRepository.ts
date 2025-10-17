import type { SalaDTO, SalaTipo } from '../salas/types';

export interface ISalaRepository {
  getAllPaginated?(skip?: number, limit?: number): Promise<SalaDTO[]>;
  getByCodigo?(codigo: string): Promise<SalaDTO>;
  getByEdificio?(edificioId: number): Promise<SalaDTO[]>;
  getByTipo?(tipo: SalaTipo): Promise<SalaDTO[]>;
  getByCapacidad?(min?: number, max?: number): Promise<SalaDTO[]>;
  getDisponibles?(bloqueId?: number): Promise<SalaDTO[]>;
}