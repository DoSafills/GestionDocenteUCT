import type { IService } from '@/domain/interfaces/IService';
import type { SalaDTO, SalaCreateDTO, SalaTipo } from '@/domain/salas/types';
import { Sala } from '@/domain/salas';
import type { IRepository } from '@/domain/repositories/IRepository';
import { SalaApiRepository } from '@/infraestructure/repositories/sala/SalaApiRepository';
import { SalaMockRepository } from '@/infraestructure/repositories/sala/SalaMockRepository';
import { ENDPOINTS } from '@/infraestructure/endpoints';
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

  private throwFriendly(e: unknown, custom?: Partial<Record<number, string>>): never {
    const msg = String((e as any)?.message ?? '');
    const m = msg.match(/Error\s+(\d{3})/);
    const code = m ? Number(m[1]) : undefined;

    if (msg.includes('El código de sala ya existe')) {
      throw new Error('El código de sala ya existe.');
    }
    if (msg.includes('No se puede eliminar la sala porque tiene clases activas')) {
      throw new Error('No se puede eliminar la sala porque tiene clases activas.');
    }
    if (msg.includes('Edificio con id') && msg.includes('no encontrado')) {
      throw new Error('Edificio no encontrado.');
    }

    const defaults: Record<number, string> = {
      400: 'Solicitud inválida.',
      401: 'No autorizado.',
      403: 'Acceso denegado.',
      404: 'Recurso no encontrado.',
      500: 'Error interno del servidor.',
    };
    const pretty = (custom?.[code!]) || defaults[code!] || 'Ha ocurrido un error.';
    throw new Error(pretty);
  }

  async obtenerTodas(): Promise<Sala[]> {
    try {
      const list = await this.repo.getAll(true);
      return list.map(this.factory);
    } catch (e) {
      this.throwFriendly(e);
    }
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
    try {
      const dto = await this.repo.create(data as any);
      return this.factory(dto);
    } catch (e) {
      this.throwFriendly(e, {
        404: 'Edificio no encontrado.',
        400: 'Datos inválidos o código duplicado.',
      });
    }
  }

  async actualizar(id: number, data: Partial<SalaCreateDTO>): Promise<Sala> {
    try {
      const dto = await this.repo.update(id, data as any);
      return this.factory(dto);
    } catch (e) {
      this.throwFriendly(e, {
        404: 'Sala no encontrada.',
        400: 'Datos inválidos o código duplicado.',
      });
    }
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (e) {
      // 400 clases activas; 404 sala no encontrada
      const msg = String((e as any)?.message ?? '');
      if (msg.includes('clases activas')) {
        throw new Error('No se puede eliminar la sala porque tiene clases activas.');
      }
      this.throwFriendly(e, { 404: 'Sala no encontrada.' });
    }
  }

  async buscar(skip = 0, limit = 100): Promise<Sala[]> {
    try {
      if (this.repo.getAllPaginated) {
        const list = await this.repo.getAllPaginated(skip, limit);
        return list.map(this.factory);
      }
      const all = await this.repo.getAll(true);
      return all.slice(skip, skip + limit).map(this.factory);
    } catch (e) {
      this.throwFriendly(e);
    }
  }

  async obtenerPorCodigo(codigo: string): Promise<Sala> {
    try {
      if (!this.repo.getByCodigo) throw new Error('No soportado');
      const dto = await this.repo.getByCodigo(codigo);
      return this.factory(dto);
    } catch (e) {
      this.throwFriendly(e, { 404: 'Sala no encontrada.' });
    }
  }

  async listarPorEdificio(edificioId: number): Promise<Sala[]> {
    try {
      if (this.repo.getByEdificio) {
        const list = await this.repo.getByEdificio(edificioId);
        return list.map(this.factory);
      }
      const all = await this.repo.getAll(true);
      return all.filter(s => s.edificio_id === edificioId).map(this.factory);
    } catch (e: any) {
      if (String(e?.message || '').includes('404')) return [];
      this.throwFriendly(e);
    }
  }

  async filtrarPorTipo(tipo: SalaTipo): Promise<Sala[]> {
    try {
      if (this.repo.getByTipo) {
        const list = await this.repo.getByTipo(tipo);
        return list.map(this.factory);
      }
      const all = await this.repo.getAll(true);
      return all.filter(s => s.tipo === tipo).map(this.factory);
    } catch (e) {
      this.throwFriendly(e);
    }
  }

  async filtrarPorCapacidad(r?: { min?: number; max?: number }): Promise<Sala[]> {
    try {
      if (this.repo.getByCapacidad) {
        const list = await this.repo.getByCapacidad(r?.min, r?.max);
        return list.map(this.factory);
      }
      const all = await this.repo.getAll(true);
      return all
        .filter(s => (r?.min == null || s.capacidad >= r.min) && (r?.max == null || s.capacidad <= r.max))
        .map(this.factory);
    } catch (e) {
      this.throwFriendly(e);
    }
  }

  async disponibles(r?: { bloqueId?: number }): Promise<Sala[]> {
    try {
      if (this.repo.getDisponibles) {
        const list = await this.repo.getDisponibles(r?.bloqueId);
        return list.map(this.factory);
      }
      const all = await this.repo.getAll(true);
      return all.filter(s => s.disponible).map(this.factory);
    } catch (e) {
      this.throwFriendly(e);
    }
  }
}

// export const salaService = new SalaService();
export const salaService = new SalaService(new SalaMockRepository());
