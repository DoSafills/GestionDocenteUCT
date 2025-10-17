import type { IService } from '@/domain/interfaces/IService';
import type { EdificioDTO, EdificioCreateDTO } from '@/domain/edificios/types';
import { Edificio } from '@/domain/edificios';
import type { IRepository } from '@/domain/repositories/IRepository';
import { EdificioApiRepository } from '@/infraestructure/repositories/edificio/EdificioApiRepository';
import { EdificioMockRepository } from '@/infraestructure/repositories/edificio/EdificioMockRepository';
import { ENDPOINTS } from '@/endpoints';

type Repo = IRepository<EdificioDTO> & { getByCampus?(campusId: number): Promise<EdificioDTO[]> };

export class EdificioService implements IService<Edificio, EdificioDTO> {
  private repo: Repo;
  constructor(repo?: Repo) {
    this.repo = (repo ?? new EdificioApiRepository(ENDPOINTS.EDIFICIO)) as Repo;
  }
  private factory = (dto: EdificioDTO) => new Edificio(dto);

  async obtenerTodas(): Promise<Edificio[]> {
    try {
      const list = await this.repo.getAll(true);
      return list.map(this.factory);
    } catch (e: any) {
      if (String(e?.message || '').includes('404')) return [];
      throw e;
    }
  }
  async obtenerPorId(id: number): Promise<Edificio | undefined> {
    try {
      const dto = await this.repo.getById(id);
      return this.factory(dto);
    } catch {
      return undefined;
    }
  }
  async crearNueva(data: EdificioCreateDTO): Promise<Edificio> {
    const dto = await this.repo.create(data as any);
    return this.factory(dto);
  }
  async actualizar(id: number, data: Partial<EdificioCreateDTO>): Promise<Edificio> {
    const dto = await this.repo.update(id, data as any);
    return this.factory(dto);
  }
  async eliminar(id: number): Promise<void> {
    await this.repo.delete(id);
  }
  async listarPorCampus(campusId: number): Promise<Edificio[]> {
    if (!this.repo.getByCampus) {
      const all = await this.repo.getAll(true);
      return all.filter(e => e.campus_id === campusId).map(this.factory);
    }
    const list = await this.repo.getByCampus(campusId);
    return list.map(this.factory);
  }
}

// export const edificioService = new EdificioService(new EdificioApiRepository());
export const edificioService = new EdificioService(new EdificioMockRepository());
