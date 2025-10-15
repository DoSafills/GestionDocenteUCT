import { DocenteService } from "@/infraestructure/services/docente/DocenteService"
import { DocenteApiRepository } from "@/infraestructure/repositories/docente/DocenteApiRepository"
import { DocenteMockRepository } from "@/infraestructure/repositories/docente/DocenteMockRepository"
import { docentesMock } from "@/data/docentes"

let mode: "mock" | "api" = "mock"

let repo =
  mode === "mock"
    ? new DocenteMockRepository(docentesMock)
    : new DocenteApiRepository()

export const docenteService = new DocenteService(repo)

export function setDocentesMode(next: "mock" | "api") {
  if (mode === next) return
  mode = next
  repo = mode === "mock" ? new DocenteMockRepository(docentesMock) : new DocenteApiRepository()
  docenteService.setRepo(repo) 
}
export function getDocentesMode() { return mode }
