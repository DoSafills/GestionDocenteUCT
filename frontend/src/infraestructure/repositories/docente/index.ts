// frontend/src/infraestructure/repositories/docente/index.ts
import type { IRepository } from "@/domain/repositories/IRepository"
import type { DocenteConUsuario } from "@/domain/docentes/types"
import { DocenteApiRepository } from "./DocenteApiRepository"
import { DocenteMockRepository } from "./DocenteMockRepository"

type Mode = "api" | "mock"

const api = new DocenteApiRepository()
const mock = new DocenteMockRepository([
  {
    id: 1,
    nombre: "María Pérez",
    email: "maria@uni.cl",
    rol: "docente",
    activo: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    docente: { user_id: 1, departamento: "Matemáticas" },
  },
])

let mode: Mode = "mock"
// 👇 cambia el tipo acá
let current: IRepository<DocenteConUsuario> = mock

const listeners = new Set<() => void>()

export function getDocentesRepo(): IRepository<DocenteConUsuario> { return current }
export function getDocentesMode(): Mode { return mode }
export function setDocentesMode(next: Mode) {
  if (mode === next) return
  mode = next
  current = mode === "api" ? api : mock
  listeners.forEach((l) => l())
}
export function subscribeDocentesRepo(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
