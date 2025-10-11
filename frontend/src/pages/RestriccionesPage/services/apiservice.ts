import axios from "axios";
import type { AxiosInstance } from "axios";

// Clase genérica para cualquier endpoint
export class ApiService<T> {
  protected api: AxiosInstance;

  /**
   * @param endpoint URL base del endpoint
   * @param token Token de autorización opcional (Bearer)
   */
  constructor(endpoint: string, token?: string) {
    this.api = axios.create({
      baseURL: endpoint,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  /** Obtener todos los registros */
  async getAll(): Promise<T[]> {
    const res = await this.api.get<T[]>("");
    return res.data;
  }

  /** Obtener un registro por ID */
  async getById(id: number | string): Promise<T> {
    const res = await this.api.get<T>(`${id}`);
    return res.data;
  }

  /** Crear un nuevo registro */
  async create(item: Omit<T, "id">): Promise<T> {
    const res = await this.api.post<T>("", item, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }

  /** Actualizar un registro por completo */
  async update(id: number | string, item: Partial<T>): Promise<T> {
    const res = await this.api.put<T>(`${id}`, item, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }

  /** Actualizar parcialmente un registro */
  async patch(id: number | string, item: Partial<T>): Promise<T> {
    const res = await this.api.patch<T>(`${id}`, item, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }

  /** Eliminar un registro */
  async delete(id: number | string): Promise<void> {
    await this.api.delete(`${id}`);
  }
}
