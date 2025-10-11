// src/services/restriccionesApi.ts
import axios from "axios";
import { getAccessToken } from "../../../auth/tokenStore";
import { ENDPOINTS } from "@/endpoints";

export interface RestriccionDTO {
  id?: number;
  tipo: string;
  valor: string;
  prioridad: number;
  restriccion_blanda?: boolean;
  restriccion_dura?: boolean;
}

// Crear instancia de Axios con token dinámico
const api = axios.create();

async function getHeaders() {
  const token = getAccessToken();
  return token
    ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
    : { Accept: "application/json" };
}

// Obtener todas las restricciones
export async function obtenerTodas(): Promise<RestriccionDTO[]> {
  const headers = await getHeaders();
  const res = await api.get<RestriccionDTO[]>(ENDPOINTS.RESTRICCIONES, { headers });
  return res.data;
}

// Obtener restricción por ID
export async function obtenerPorId(id: number): Promise<RestriccionDTO> {
  const headers = await getHeaders();
  const res = await api.get<RestriccionDTO>(`${ENDPOINTS.RESTRICCIONES}/${id}`, { headers });
  return res.data;
}

// Crear nueva restricción
export async function crearRestriccion(data: RestriccionDTO): Promise<RestriccionDTO> {
  const token = getAccessToken();
  if (!token) throw new Error("No hay token de acceso, inicia sesión primero");

  const res = await api.post<RestriccionDTO>(ENDPOINTS.RESTRICCIONES, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Actualizar restricción completa (PUT)
export async function actualizarRestriccion(id: number, data: RestriccionDTO): Promise<RestriccionDTO> {
  const token = getAccessToken();
  if (!token) throw new Error("No hay token de acceso, inicia sesión primero");

  const res = await api.put<RestriccionDTO>(`${ENDPOINTS.RESTRICCIONES}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Actualizar restricción parcial (PATCH)
export async function actualizarParcial(id: number, data: Partial<RestriccionDTO>): Promise<RestriccionDTO> {
  const token = getAccessToken();
  if (!token) throw new Error("No hay token de acceso, inicia sesión primero");

  const res = await api.patch<RestriccionDTO>(`${ENDPOINTS.RESTRICCIONES}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Eliminar restricción
export async function eliminarRestriccion(id: number): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("No hay token de acceso, inicia sesión primero");

  await api.delete(`${ENDPOINTS.RESTRICCIONES}/${id}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
}
