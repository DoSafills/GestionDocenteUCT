// src/infraestructure/repositories/docente/index.ts
import type { IRepository } from "@/domain/repositories/IRepository";
import type { DocenteConUsuario } from "@/domain/docentes/types";
import { DocenteMockRepository } from "./DocenteMockRepository";

/**
 * Modo fijo a "mock" para evitar errores en Vercel si no existe DocenteApiRepository.
 * Cuando tengas la implementación API, puedes agregarla y conmutar aquí.
 */
export type DocentesRepoMode = "mock";
let mode: DocentesRepoMode = "mock";

export const getDocentesMode = (): DocentesRepoMode => mode;
// Queda por compatibilidad, hoy solo permite "mock"
export const setDocentesMode = (_m: DocentesRepoMode) => { /* noop */ };

/** Factory del repositorio de docentes */
export function getDocentesRepo(): IRepository<DocenteConUsuario> {
  // Hoy devolvemos siempre el mock para garantizar build/ejecución
  return new DocenteMockRepository();
}

// Exponemos el mock explícitamente por si lo quieres instanciar directo
export { DocenteMockRepository };
