import { ApiService } from './ApiService';

export class ApiRepository<T extends { id: number }> extends ApiService {
  protected cache: T[] = [];

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Obtener todos los items
   */
  async getAll(forceRefresh = false): Promise<T[]> {
    if (this.cache.length > 0 && !forceRefresh) {
      return structuredClone(this.cache);
    }

    const data = await this.get();
    this.cache = data;
    return structuredClone(this.cache);
  }

  /**
   * Obtener item por ID
   */
  async getById(id: number): Promise<T | null> {
    const cached = this.cache.find(x => x.id === id);
    if (cached) return structuredClone(cached);

    const data = await this.get(`/${id}`);
    if (data) this.cache.push(data);
    return data ? structuredClone(data) : null;
  }

  /**
   * Crear un item
   */
  async create(item: Omit<T, 'id'>): Promise<T> {
    const data = await this.post('', item);
    this.cache.unshift(data);
    return structuredClone(data);
  }

  /**
   * Actualizar item completo (PUT)
   */
  async update(id: number, item: Partial<Omit<T, 'id'>>): Promise<T> {
    const data = await this.put(`/${id}`, item);
    const index = this.cache.findIndex(x => x.id === id);
    if (index !== -1) this.cache[index] = data;
    else this.cache.push(data);
    return structuredClone(data);
  }

  /**
   * Actualización parcial (PATCH)
   */
  async patch(id: number, item: Partial<Omit<T, 'id'>>): Promise<T> {
    const data = await this.patch(`/${id}`, item);
    const index = this.cache.findIndex(x => x.id === id);
    if (index !== -1) this.cache[index] = data;
    else this.cache.unshift(data);
    return structuredClone(data);
  }

  /**
   * Eliminar item
   */
  async deleteById(id: number): Promise<void> {
    await this.delete(`/${id}`);
    this.cache = this.cache.filter(x => x.id !== id);
  }
}
