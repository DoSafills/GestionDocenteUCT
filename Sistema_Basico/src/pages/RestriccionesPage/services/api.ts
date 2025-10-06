// src/services/restriccionesApi.ts
import { getAccessToken } from "../../../auth/tokenStore";

const API_BASE = "https://sgh.inf.uct.cl/api/restricciones/";

export interface RestriccionDTO {
  id?: number;
  tipo: string;
  valor: string;
  prioridad: number;
  restriccion_blanda?: boolean;
  restriccion_dura?: boolean;
}

// Obtener todas las restricciones
export async function obtenerTodas(): Promise<RestriccionDTO[]> {
  const token = getAccessToken();
  const res = await fetch(API_BASE, {
    headers: {
      accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Error al obtener restricciones");
  return res.json();
}

// Obtener restricción por ID
export async function obtenerPorId(id: number): Promise<RestriccionDTO> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}${id}`, {
    headers: {
      accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Error al obtener la restricción");
  return res.json();
}

// Crear nueva restricción
export async function crearRestriccion(data: RestriccionDTO): Promise<RestriccionDTO> {
  const token = getAccessToken();
  if (!token) throw new Error("No hay token de acceso, inicia sesión primero");

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear la restricción");
  return res.json();
}

// Actualizar restricción completa (PUT)
export async function actualizarRestriccion(id: number, data: RestriccionDTO): Promise<RestriccionDTO> {
  const token = getAccessToken();
  if (!token) throw new Error("No hay token de acceso, inicia sesión primero");

  const res = await fetch(`${API_BASE}${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar la restricción");
  return res.json();
}

// Actualizar restricción parcial (PATCH)
export async function actualizarParcial(id: number, data: Partial<RestriccionDTO>): Promise<RestriccionDTO> {
  const token = getAccessToken();
  if (!token) throw new Error("No hay token de acceso, inicia sesión primero");

  const res = await fetch(`${API_BASE}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar parcialmente");
  return res.json();
}

// Eliminar restricción
export async function eliminarRestriccion(id: number): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("No hay token de acceso, inicia sesión primero");

  const res = await fetch(`${API_BASE}${id}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al eliminar la restricción");
}
