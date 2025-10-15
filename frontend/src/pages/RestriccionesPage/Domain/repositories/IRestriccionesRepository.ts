import type { RestriccionAcademica } from "../entities/restriccionespage/RestriccionAcademica";

export interface IRestriccionesRepository {
  // Listar todas las restricciones
  listar(): Promise<RestriccionAcademica[]>;

  // Obtener una restricción por ID
  obtenerPorId(id: string): Promise<RestriccionAcademica | null>;

  // Crear una nueva restricción
  crear(restriccion: Omit<RestriccionAcademica, "id">): Promise<RestriccionAcademica>;

  // Editar una restricción existente
  editar(id: string, restriccion: Partial<Omit<RestriccionAcademica, "id">>): Promise<RestriccionAcademica>;

  // Eliminar una restricción
  eliminar(id: string): Promise<void>;

  // Alternar estado activo/inactivo de una restricción
  toggleEstado(id: string): Promise<RestriccionAcademica>;
}
