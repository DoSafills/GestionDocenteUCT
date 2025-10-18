import { MockRepository } from "../MockRepository"
import type { DocenteConUsuario, DocenteCreateDTO, DocenteUpdateDTO } from "../../../domain/docentes/types"
import { docentesMock } from "../../../data/docentes"
import { normalize } from "../../../utils/string"

export class DocenteMockRepository extends MockRepository<DocenteConUsuario> {
  constructor(initial: DocenteConUsuario[] = docentesMock) { super(initial) }

  async createFromDTO(input: DocenteCreateDTO) {
    const now = new Date().toISOString()
    const payload: Omit<DocenteConUsuario,"id"> = {
      nombre: input.nombre,
      email: input.email.toLowerCase(),
      rol: "docente",
      activo: input.activo ?? true,
      created_at: now,
      updated_at: now,
      docente: { user_id: 0, departamento: input.departamento },
    }
    const created = await super.create(payload)
    if (created.docente.user_id !== created.id) {
      created.docente.user_id = created.id
      return super.update(created.id, created)
    }
    return created
  }

  async updateFromDTO(id: number, input: DocenteUpdateDTO) {
    const current = await this.getById(id)
    const patch: Partial<Omit<DocenteConUsuario,"id">> = {
      ...(input.nombre !== undefined ? { nombre: input.nombre } : {}),
      ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
      ...(input.activo !== undefined ? { activo: input.activo } : {}),
      ...(input.departamento !== undefined
        ? { docente: { ...current.docente, departamento: input.departamento } }
        : {}),
      updated_at: new Date().toISOString(),
    }
    return super.update(id, patch)
  }

  async search(term: string): Promise<DocenteConUsuario[]> {
    const q = normalize(term)
    const all = await this.getAll()
    return all.filter(d =>
      normalize(d.nombre).includes(q) ||
      normalize(d.docente.departamento).includes(q) ||
      normalize(d.email).includes(q)
    )
  }
}
