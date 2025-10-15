// frontend/src/infraestructure/services/docente/DocenteService.ts
import type { IRepository } from "@/domain/repositories/IRepository"
import type { IService } from "@/domain/interfaces/IService"
import { DocenteUsuario } from "@/domain/docentes"
import type { DocenteConUsuario } from "@/domain/docentes/types"
import { normalize } from "@/utils/string"

export class DocenteService implements IService<DocenteUsuario, DocenteConUsuario> {
  private repo: IRepository<DocenteConUsuario>

  constructor(repo: IRepository<DocenteConUsuario>) {
    this.repo = repo
  }
  setRepo(repo: IRepository<DocenteConUsuario>) { this.repo = repo }

  async obtenerTodas(): Promise<DocenteUsuario[]> {
    const dtos = await this.repo.getAll(true)
    return dtos.map(d => new DocenteUsuario(d))
  }
  async obtenerPorId(id: number): Promise<DocenteUsuario | undefined> {
    const dto = await this.repo.getById(id).catch(() => undefined)
    return dto ? new DocenteUsuario(dto) : undefined
  }
  async crearNueva(data: Omit<DocenteConUsuario, "id">): Promise<DocenteUsuario> {
    const created = await this.repo.create(data as any)
    return new DocenteUsuario(created)
  }
  async actualizar(id: number, data: Partial<Omit<DocenteConUsuario, "id">>): Promise<DocenteUsuario> {
    const updated = await this.repo.update(id, data as any)
    return new DocenteUsuario(updated)
  }
  async eliminar(id: number): Promise<void> { await this.repo.delete(id) }

  async buscar(term: string): Promise<DocenteUsuario[]> {
    const anyRepo = this.repo as unknown as { search?: (t: string) => Promise<DocenteConUsuario[]> }
    if (typeof anyRepo.search === "function") {
      const found = await anyRepo.search(normalize(term))
      return found.map(d => new DocenteUsuario(d))
    }
    const all = await this.repo.getAll(true)
    const q = normalize(term)
    return all
      .filter(d =>
        normalize(d.nombre).includes(q) ||
        normalize(d.email).includes(q) ||
        normalize(d.docente?.departamento ?? "").includes(q)
      )
      .map(d => new DocenteUsuario(d))
  }
}
