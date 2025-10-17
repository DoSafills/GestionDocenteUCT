import type { Sala } from '@/domain/salas';
import type { SalaTipo } from '@/domain/salas/types';
import type { IService } from '@/domain/interfaces/IService';
import type { SalaDTO } from '@/domain/salas/types';

export interface ISalaService extends IService<Sala, SalaDTO> {
  buscar(skip?: number, limit?: number): Promise<Sala[]>;
  obtenerPorCodigo(codigo: string): Promise<Sala>;
  listarPorEdificio(edificioId: number): Promise<Sala[]>;
  filtrarPorTipo(tipo: SalaTipo): Promise<Sala[]>;
  filtrarPorCapacidad(r?: { min?: number; max?: number }): Promise<Sala[]>;
  disponibles(r?: { bloqueId?: number }): Promise<Sala[]>;
}
