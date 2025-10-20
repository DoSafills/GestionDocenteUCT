import type { IService } from '@/domain/interfaces/IService';
import type { EdificioDTO, EdificioCreateDTO } from '@/domain/edificios/types';
import { Edificio } from '@/domain/edificios';
import type { IRepository } from '@/domain/repositories/IRepository';
import { EdificioApiRepository } from '@/infraestructure/repositories/edificio/EdificioApiRepository';
import { EdificioMockRepository } from '@/infraestructure/repositories/edificio/EdificioMockRepository';
import { ENDPOINTS } from '@/endpoints';

import type { IEdificioService } from '@/domain/interfaces/IEdificioService';
import type { IEdificioRepository } from '@/domain/repositories/IEdificioRepository';

type Repo = IRepository<EdificioDTO> & IEdificioRepository;

export class EdificioService
  implements IService<Edificio, EdificioDTO>, IEdificioService {
  private repo: Repo;
  constructor(repo?: Repo) {
    this.repo = (repo ?? new EdificioApiRepository(ENDPOINTS.EDIFICIO)) as Repo;
  }

  private factory = (dto: EdificioDTO) => new Edificio(dto);

  private parseHttp(e: any): { status?: number; detail?: string } {
    const msg = String(e?.message ?? e ?? '');
    const m = msg.match(/Error\s+(\d{3}):\s*([\s\S]*)$/);
    return m ? { status: Number(m[1]), detail: m[2]?.trim() } : {};
  }

  async obtenerTodas(): Promise<Edificio[]> {
    try {
      const list = await this.repo.getAll(true);
      return list.map(this.factory);
    } catch (e: any) {
      const { status } = this.parseHttp(e);
      if (status === 404) return [];
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
    try {
      const dto = await this.repo.create(data as any);
      return this.factory(dto);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 404) throw new Error(detail || 'Campus asociado no existe');
      throw e;
    }
  }

  async actualizar(id: number, data: Partial<EdificioCreateDTO>): Promise<Edificio> {
    try {
      const dto = await this.repo.update(id, data as any);
      return this.factory(dto);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 404) {
        throw new Error(detail || 'Edificio o campus no encontrado');
      }
      throw e;
    }
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 404) throw new Error(detail || 'Edificio no encontrado');
      throw e;
    }
  }

  async listarPorCampus(campusId: number): Promise<Edificio[]> {
    try {
      if (!this.repo.getByCampus) {
        const all = await this.repo.getAll(true);
        return all.filter(e => e.campus_id === campusId).map(this.factory);
      }
      const list = await this.repo.getByCampus(campusId);
      return list.map(this.factory);
    } catch (e: any) {
      const { status } = this.parseHttp(e);
      if (status === 404) return []; 
      throw e;
    }
  }
}

export const edificioService = new EdificioService();
// export const edificioService = new EdificioService(new EdificioMockRepository());
