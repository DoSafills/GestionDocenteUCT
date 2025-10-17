import type { IService } from '@/domain/interfaces/IService';
import type { SalaDTO, SalaCreateDTO, SalaTipo } from '@/domain/salas/types';
import { Sala } from '@/domain/salas';
import type { IRepository } from '@/domain/repositories/IRepository';
import { SalaApiRepository } from '@/infraestructure/repositories/sala/SalaApiRepository';
import { SalaMockRepository } from '@/infraestructure/repositories/sala/SalaMockRepository';
import { ENDPOINTS } from '@/endpoints';
import type { ISalaService } from '@/domain/interfaces/ISalaService';
import type { ISalaRepository } from '@/domain/repositories/ISalaRepository';

type Repo = IRepository<SalaDTO> & ISalaRepository;

export class SalaService
  implements IService<Sala, SalaDTO>, ISalaService { 
  private repo: Repo;
  constructor(repo?: Repo) {
    this.repo = (repo ?? new SalaApiRepository(ENDPOINTS.SALAS)) as Repo;
  }

  private factory = (dto: SalaDTO) => new Sala(dto);

  async obtenerTodas(): Promise<Sala[]> {
    const list = await this.repo.getAll(true);
    return list.map(this.factory);
  }
  async obtenerPorId(id: number): Promise<Sala | undefined> {
    try {
      const dto = await this.repo.getById(id);
      return this.factory(dto);
    } catch {
      return undefined;
    }
  }
  async crearNueva(data: SalaCreateDTO): Promise<Sala> {
    const dto = await this.repo.create(data as any);
    return this.factory(dto);
  }
  async actualizar(id: number, data: Partial<SalaCreateDTO>): Promise<Sala> {
    const dto = await this.repo.update(id, data as any);
    return this.factory(dto);
  }
  async eliminar(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async buscar(skip = 0, limit = 100): Promise<Sala[]> {
    if (this.repo.getAllPaginated) {
      const list = await this.repo.getAllPaginated(skip, limit);
      return list.map(this.factory);
    }
    const all = await this.repo.getAll(true);
    return all.slice(skip, skip + limit).map(this.factory);
  }
  async obtenerPorCodigo(codigo: string): Promise<Sala> {
    if (!this.repo.getByCodigo) throw new Error('No soportado');
    const dto = await this.repo.getByCodigo(codigo);
    return this.factory(dto);
  }
  async listarPorEdificio(edificioId: number): Promise<Sala[]> {
    if (this.repo.getByEdificio) {
      const list = await this.repo.getByEdificio(edificioId);
      return list.map(this.factory);
    }
    const all = await this.repo.getAll(true);
    return all.filter(s => s.edificio_id === edificioId).map(this.factory);
  }
  async filtrarPorTipo(tipo: SalaTipo): Promise<Sala[]> {
    if (this.repo.getByTipo) {
      const list = await this.repo.getByTipo(tipo);
      return list.map(this.factory);
    }
    const all = await this.repo.getAll(true);
    return all.filter(s => s.tipo === tipo).map(this.factory);
  }
  async filtrarPorCapacidad(r?: { min?: number; max?: number }): Promise<Sala[]> {
    if (this.repo.getByCapacidad) {
      const list = await this.repo.getByCapacidad(r?.min, r?.max);
      return list.map(this.factory);
    }
    const all = await this.repo.getAll(true);
    return all.filter(s => (r?.min == null || s.capacidad >= r.min) && (r?.max == null || s.capacidad <= r.max)).map(this.factory);
  }
  async disponibles(r?: { bloqueId?: number }): Promise<Sala[]> {
    if (this.repo.getDisponibles) {
      const list = await this.repo.getDisponibles(r?.bloqueId);
      return list.map(this.factory);
    }
    const all = await this.repo.getAll(true);
    return all.filter(s => s.disponible).map(this.factory);
  }
}

// export const salaService = new SalaService(new SalaApiRepository());
export const salaService = new SalaService(new SalaMockRepository());
