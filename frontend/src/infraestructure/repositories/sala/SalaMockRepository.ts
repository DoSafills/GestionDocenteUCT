import { MockRepository } from '@/infraestructure/repositories/MockRepository';
import type { SalaDTO, SalaTipo } from '@/domain/salas/types';
import { salasMock } from '@/data/salas';

export class SalaMockRepository extends MockRepository<SalaDTO> {
  constructor() {
    super(salasMock);
  }

  async getAllPaginated(skip = 0, limit = 100): Promise<SalaDTO[]> {
    const all = await this.getAll();
    return all.slice(skip, skip + limit);
  }

  async getByCodigo(codigo: string): Promise<SalaDTO> {
    const all = await this.getAll();
    const found = all.find(s => s.codigo === codigo.toUpperCase());
    if (!found) throw new Error('Sala no encontrada');
    return structuredClone(found);
  }

  async getByEdificio(edificioId: number): Promise<SalaDTO[]> {
    const all = await this.getAll();
    return all.filter(s => s.edificio_id === edificioId);
  }

  async getByTipo(tipo: SalaTipo): Promise<SalaDTO[]> {
    const all = await this.getAll();
    return all.filter(s => s.tipo === tipo);
  }

  async getByCapacidad(min?: number, max?: number): Promise<SalaDTO[]> {
    const all = await this.getAll();
    return all.filter(s => (min == null || s.capacidad >= min) && (max == null || s.capacidad <= max));
  }

  async getDisponibles(bloqueId?: number): Promise<SalaDTO[]> {
    const all = await this.getAll();
    return all.filter(s => s.disponible === true);
  }
}
