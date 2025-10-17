import type { IService } from '@/domain/interfaces/IService';
import type { CampusDTO, CampusCreateDTO } from '@/domain/campus/types';
import { Campus } from '@/domain/campus';
import type { IRepository } from '@/domain/repositories/IRepository';
import { CampusApiRepository } from '@/infraestructure/repositories/campus/CampusApiRepository';
import { CampusMockRepository } from '@/infraestructure/repositories/campus/CampusMockRepository';
import { ENDPOINTS } from '@/endpoints';

export class CampusService implements IService<Campus, CampusDTO> {
  private repo: IRepository<CampusDTO>;
  constructor(repo?: IRepository<CampusDTO>) {
    this.repo = repo ?? new CampusApiRepository(ENDPOINTS.CAMPUS);
  }
  private factory = (dto: CampusDTO) => new Campus(dto);

  async obtenerTodas(): Promise<Campus[]> {
    try {
      const list = await this.repo.getAll(true);
      return list.map(this.factory);
    } catch (e: any) {
      if (String(e?.message || '').includes('404')) return [];
      throw e;
    }
  }
  async obtenerPorId(id: number): Promise<Campus | undefined> {
    try {
      const dto = await this.repo.getById(id);
      return this.factory(dto);
    } catch {
      return undefined;
    }
  }
  async crearNueva(data: CampusCreateDTO): Promise<Campus> {
    const dto = await this.repo.create(data as any);
    return this.factory(dto);
  }
  async actualizar(id: number, data: Partial<CampusCreateDTO>): Promise<Campus> {
    const dto = await this.repo.update(id, data as any);
    return this.factory(dto);
  }
  async eliminar(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

// export const campusService = new CampusService(new CampusApiRepository());
export const campusService = new CampusService(new CampusMockRepository());
