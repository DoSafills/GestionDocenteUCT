import { ENDPOINTS } from "@endpoints/index";
import type { RestriccionDTO } from "../../services/RestriccionDTO";

// 🔹 Clase base genérica para peticiones HTTP
export class ApiService<T> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<R>(
    method: string,
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<R> {
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return response.status !== 204 ? await response.json() : (null as R);
  }

  public get<R = T | T[]>(endpoint = "", token?: string): Promise<R> {
    return this.request<R>("GET", endpoint, undefined, token);
  }

  public post<R = T>(endpoint = "", data?: T, token?: string): Promise<R> {
    return this.request<R>("POST", endpoint, data, token);
  }

  public put<R = T>(endpoint = "", data?: T, token?: string): Promise<R> {
    return this.request<R>("PUT", endpoint, data, token);
  }

  public patch<R = T>(endpoint = "", data?: Partial<T>, token?: string): Promise<R> {
    return this.request<R>("PATCH", endpoint, data, token);
  }

  public delete(endpoint = "", token?: string): Promise<void> {
    return this.request<void>("DELETE", endpoint, undefined, token);
  }
}

// 🔹 Servicio especializado para las restricciones
export class RestriccionApiService extends ApiService<RestriccionDTO> {
  constructor() {
    super(ENDPOINTS.RESTRICCIONES);
  }

  // Obtener todas las restricciones
  async listar(token?: string): Promise<RestriccionDTO[]> {
    return this.get<RestriccionDTO[]>("", token);
  }

  // Obtener una restricción por ID
  async obtenerPorId(id: number, token?: string): Promise<RestriccionDTO> {
    return this.get<RestriccionDTO>(`${id}/`, token);
  }

  // Crear una nueva restricción
  async crear(data: RestriccionDTO, token: string): Promise<RestriccionDTO> {
    return this.post<RestriccionDTO>("", data, token);
  }

  // Actualizar una restricción
  async actualizar(id: number, data: RestriccionDTO, token: string): Promise<RestriccionDTO> {
    return this.put<RestriccionDTO>(`${id}/`, data, token);
  }

  // Actualización parcial
  async actualizarParcial(id: number, data: Partial<RestriccionDTO>, token: string): Promise<RestriccionDTO> {
    return this.patch<RestriccionDTO>(`${id}/`, data, token);
  }

  // Eliminar una restricción
  async eliminar(id: number, token: string): Promise<void> {
    return this.delete(`${id}/`, token);
  }
}

// 🔹 Instancia exportada lista para usar
export const restriccionApiService = new RestriccionApiService();
