import { ApiRepository } from '@/infraestructure/repositories/ApiRepository';
import type { SalaDTO, SalaTipo } from '@/domain/salas/types';

export class SalaApiRepository extends ApiRepository<SalaDTO> {
  constructor(endpoint: string) {
    super(endpoint);
  }

  async getAllPaginated(skip = 0, limit = 100): Promise<SalaDTO[]> {
    const url = new URL(this.endpoint, window.location.origin);
    url.searchParams.set('skip', String(skip));
    url.searchParams.set('limit', String(limit));
    const res = await fetch(url.toString(), { headers: this.getHeaders() });
    return this['handleResponse']<SalaDTO[]>(res);
  }

  async getByCodigo(codigo: string): Promise<SalaDTO> {
    const res = await fetch(`${this.endpoint}/codigo/${encodeURIComponent(codigo)}`, { headers: this.getHeaders() });
    return this['handleResponse']<SalaDTO>(res);
  }

  async getByEdificio(edificioId: number): Promise<SalaDTO[]> {
    const res = await fetch(`${this.endpoint}/edificio/${edificioId}`, { headers: this.getHeaders() });
    return this['handleResponse']<SalaDTO[]>(res);
  }

  async getByTipo(tipo: SalaTipo): Promise<SalaDTO[]> {
    const res = await fetch(`${this.endpoint}/buscar/tipo/${tipo}`, { headers: this.getHeaders() });
    return this['handleResponse']<SalaDTO[]>(res);
  }

  async getByCapacidad(min?: number, max?: number): Promise<SalaDTO[]> {
    const url = new URL(`${this.endpoint}/buscar/capacidad`, window.location.origin);
    if (min != null) url.searchParams.set('capacidad_min', String(min));
    if (max != null) url.searchParams.set('capacidad_max', String(max));
    const res = await fetch(url.toString(), { headers: this.getHeaders() });
    return this['handleResponse']<SalaDTO[]>(res);
  }

  async getDisponibles(bloqueId?: number): Promise<SalaDTO[]> {
    const url = new URL(`${this.endpoint}/disponibles`, window.location.origin);
    if (bloqueId != null) url.searchParams.set('bloque_id', String(bloqueId));
    const res = await fetch(url.toString(), { headers: this.getHeaders() });
    return this['handleResponse']<SalaDTO[]>(res);
  }
}
