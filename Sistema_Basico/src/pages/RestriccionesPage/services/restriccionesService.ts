import api from "./api";
import type { RestriccionAcademica } from "../types";

// Listar todas
export const obtenerRestricciones = () =>
  api.get<RestriccionAcademica[]>("/restricciones");

// Crear
export const crearRestriccion = (data: RestriccionAcademica) =>
  api.post("/restricciones", data);

// Actualizar
export const actualizarRestriccion = (id: string, data: RestriccionAcademica) =>
  api.put(`/restricciones/${id}`, data);

// Eliminar
export const eliminarRestriccion = (id: string) =>
  api.delete(`/restricciones/${id}`);

// Activar / desactivar
export const cambiarEstadoRestriccion = (id: string, activa: boolean) =>
  api.patch(`/restricciones/${id}/estado`, { activa });
