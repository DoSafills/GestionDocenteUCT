// frontend/src/infraestructure/services/DocenteService.ts
import type { DocenteConUsuario, DocenteCreateDTO, DocenteUpdateDTO } from "../../../domain/docentes/types"

export type DocenteDataSource = {
  getAll(forceRefresh?: boolean): Promise<DocenteConUsuario[]>
  getById(id: number): Promise<DocenteConUsuario>
  createFromDTO(input: DocenteCreateDTO): Promise<DocenteConUsuario>
  updateFromDTO(id: number, input: DocenteUpdateDTO): Promise<DocenteConUsuario>
  delete(id: number): Promise<void>
  search?(term: string): Promise<DocenteConUsuario[]>
}

export class DocenteService {
  private repo: DocenteDataSource
  constructor(repo: DocenteDataSource) { this.repo = repo }
  setRepo(repo: DocenteDataSource) { this.repo = repo }

  list(force?: boolean) { return this.repo.getAll(force) }
  get(id: number) { return this.repo.getById(id) }
  create(input: DocenteCreateDTO) { return this.repo.createFromDTO(input) }
  update(id: number, input: DocenteUpdateDTO) { return this.repo.updateFromDTO(id, input) }
  remove(id: number) { return this.repo.delete(id) }
  search(term: string) {
    if (!this.repo.search) return this.repo.getAll(true).then(all => all)
    return this.repo.search(term)
  }
}
