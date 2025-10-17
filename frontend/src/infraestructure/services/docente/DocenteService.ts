import type { IRepository } from "@/domain/repositories/IRepository"
import { DocenteUsuario } from "@/domain/docentes"
import type { DocenteConUsuario, DocenteCreateDTO, DocenteUpdateDTO } from "@/domain/docentes/types"
import { normalize } from "@/utils/string"
import { DocenteApiRepository } from "@/infraestructure/repositories/docente/DocenteApiRepository"
import { DocenteMockRepository } from "@/infraestructure/repositories/docente/DocenteMockRepository"

type Repo = IRepository<DocenteConUsuario> & {
  createFromDTO?: (input: DocenteCreateDTO) => Promise<DocenteConUsuario>
  updateFromDTO?: (id: number, input: DocenteUpdateDTO) => Promise<DocenteConUsuario>
  search?: (t: string) => Promise<DocenteConUsuario[]>
}

const useMock = false

let repo: Repo = useMock ? new DocenteMockRepository() : new DocenteApiRepository()

export class DocenteService {
  private repo: Repo
  constructor() { this.repo = repo }
  setMode(next: "mock" | "api") { this.repo = next === "mock" ? new DocenteMockRepository() : new DocenteApiRepository() }

  async obtenerTodas(): Promise<DocenteUsuario[]> {
    const dtos = await this.repo.getAll(true)
    return dtos.map(d => new DocenteUsuario(d))
  }

  async obtenerPorId(id: number): Promise<DocenteUsuario | undefined> {
    const dto = await this.repo.getById(id).catch(() => undefined)
    return dto ? new DocenteUsuario(dto) : undefined
  }

  async crear(input: DocenteCreateDTO): Promise<DocenteUsuario> {
    if (typeof this.repo.createFromDTO === "function") {
      const created = await this.repo.createFromDTO({
        nombre: normalize(input.nombre),
        email: input.email.toLowerCase(),
        activo: input.activo ?? true,
        departamento: normalize(input.departamento),
      })
      return new DocenteUsuario(created)
    }
    const now = new Date().toISOString()
    const payload: Omit<DocenteConUsuario, "id"> = {
      nombre: input.nombre,
      email: input.email.toLowerCase(),
      rol: "docente",
      activo: input.activo ?? true,
      created_at: now,
      updated_at: now,
      docente: { user_id: 0, departamento: normalize(input.departamento) },
    }
    const created = await this.repo.create(payload as any)
    return new DocenteUsuario(created)
  }

  async actualizarParcial(id: number, input: DocenteUpdateDTO): Promise<DocenteUsuario> {
    if (typeof this.repo.updateFromDTO === "function") {
      const updated = await this.repo.updateFromDTO(id, {
        ...(input.nombre !== undefined ? { nombre: normalize(input.nombre) } : {}),
        ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
        ...(input.activo !== undefined ? { activo: input.activo } : {}),
        ...(input.departamento !== undefined ? { departamento: normalize(input.departamento) } : {}),
      })
      return new DocenteUsuario(updated)
    }
    const current = await this.repo.getById(id)
    const patch: Partial<Omit<DocenteConUsuario,"id">> = {
      ...(input.nombre !== undefined ? { nombre: input.nombre } : {}),
      ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
      ...(input.activo !== undefined ? { activo: input.activo } : {}),
      ...(input.departamento !== undefined ? { docente: { ...current.docente, departamento: normalize(input.departamento) } } : {}),
      updated_at: new Date().toISOString(),
    }
    const updated = await this.repo.update(id, patch as any)
    return new DocenteUsuario(updated)
  }

  async eliminar(id: number): Promise<void> { await this.repo.delete(id) }

  async buscar(term: string): Promise<DocenteUsuario[]> {
    const q = normalize(term)
    if (typeof this.repo.search === "function") {
      const found = await this.repo.search(q)
      return found.map(d => new DocenteUsuario(d))
    }
    const all = await this.repo.getAll(true)
    return all
      .filter(d =>
        normalize(d.nombre).includes(q) ||
        normalize(d.email).includes(q) ||
        normalize(d.docente.departamento).includes(q)
      )
      .map(d => new DocenteUsuario(d))
  }
}

export const docenteService = new DocenteService()
