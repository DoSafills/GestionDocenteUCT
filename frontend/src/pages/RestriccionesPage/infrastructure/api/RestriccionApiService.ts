import { ENDPOINTS } from "@endpoints/index";
import { ApiService } from "../../services/apiservice";
import type { RestriccionDTO } from "../../services/RestriccionDTO";

export class RestriccionApiService extends ApiService<RestriccionDTO> {
  constructor() {
    super(ENDPOINTS.RESTRICCIONES);
  }

  // 🔹 Obtener todas las restricciones
  async listar(token?: string): Promise<RestriccionDTO[]> {
    return await this.get("", token);
  }

  // 🔹 Obtener una restricción por ID
  async obtenerPorId(id: number, token?: string): Promise<RestriccionDTO> {
    return await this.get(`${id}/`, token);
  }

  // 🔹 Crear una nueva restricción
  async crear(data: RestriccionDTO, token: string): Promise<RestriccionDTO> {
    return await this.post("", data, token);
  }

  // 🔹 Actualizar una restricción (PUT)
  async actualizar(id: number, data: RestriccionDTO, token: string): Promise<RestriccionDTO> {
    return await this.put(`${id}/`, data, token);
  }

  // 🔹 Actualización parcial (PATCH)
  async actualizarParcial(id: number, data: Partial<RestriccionDTO>, token: string): Promise<RestriccionDTO> {
    return await this.patch(`${id}/`, data, token);
  }

  // 🔹 Eliminar una restricción
  async eliminar(id: number, token: string): Promise<void> {
    await this.delete(`${id}/`, token);
  }
}

// Instancia exportada
export const restriccionApiService = new RestriccionApiService();
