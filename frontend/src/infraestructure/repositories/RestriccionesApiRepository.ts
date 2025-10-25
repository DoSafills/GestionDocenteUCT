import { ApiService } from '../../api/Restriccionesapiservice';

export class ApiRepository<T extends { id: number }> extends ApiService {
  protected cache: T[] = [];

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(forceRefresh = false): Promise<T[]> {
    if (this.cache.length > 0 && !forceRefresh) return structuredClone(this.cache);

    const data = await this.get();
    this.cache = data;
    return structuredClone(this.cache);
  }

  async getById(id: number): Promise<T> {
    const cached = this.cache.find(x => x.id === id);
    if (cached) return structuredClone(cached);

    const data = await this.get(`/${id}`);
    if (!data) throw new Error(`Item con id ${id} no encontrado`);

    this.cache.push(data);
    return structuredClone(data);
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const data = await this.post('', item);
    this.cache.push(data);
    return structuredClone(data);
  }

  async update(id: number, item: Partial<Omit<T, 'id'>>): Promise<T> {
    const data = await this.put(`/${id}`, item);
    const index = this.cache.findIndex(x => x.id === id);
    if (index !== -1) this.cache[index] = data;
    else this.cache.push(data);
    return structuredClone(data);
  }

  // Cambiado a patchItem para evitar conflicto de tipos con ApiService
  async patchItem(id: number, item: Partial<Omit<T, 'id'>>): Promise<T> {
    const data = await super.patch(`/${id}`, item);
    const index = this.cache.findIndex(x => x.id === id);
    if (index !== -1) this.cache[index] = data;
    else this.cache.push(data);
    return structuredClone(data);
  }

  // Cambiado a deleteItem para evitar conflicto de tipos con ApiService
  async deleteItem(id: number): Promise<void> {
    await super.delete(`/${id}`);
    this.cache = this.cache.filter(x => x.id !== id);
  }
}
