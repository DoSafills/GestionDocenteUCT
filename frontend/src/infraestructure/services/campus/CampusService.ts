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

  private parseHttp(e: any): { status?: number; detail?: string } {
    const msg = String(e?.message ?? e ?? '');
    const m = msg.match(/Error\s+(\d{3}):\s*([\s\S]*)$/);
    return m ? { status: Number(m[1]), detail: m[2]?.trim() } : {};
  }

  async obtenerTodas(): Promise<Campus[]> {
    try {
      const list = await this.repo.getAll(true);
      return list.map(this.factory);
    } catch (e: any) {
      const { status } = this.parseHttp(e);
      if (status === 404) return [];
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
    try {
      const dto = await this.repo.create(data as any);
      return this.factory(dto);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 400) {
        throw new Error(detail || 'Ya existe un campus con ese nombre');
      }
      throw e;
    }
  }

  async actualizar(id: number, data: Partial<CampusCreateDTO>): Promise<Campus> {
    try {
      const dto = await this.repo.update(id, data as any);
      return this.factory(dto);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 404) throw new Error(detail || 'Campus no encontrado');
      if (status === 405) throw new Error('La actualización de campus no está disponible');
      throw e;
    }
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 404) throw new Error(detail || 'Campus no encontrado');
      throw e;
    }
  }
}

// export const campusService = new CampusService();
export const campusService = new CampusService(new CampusMockRepository());
