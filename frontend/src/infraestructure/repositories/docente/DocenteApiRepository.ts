// frontend/src/infraestructure/repositories/docente/DocenteApiRepository.ts
import { ApiRepository } from "../ApiRepository"
import { ENDPOINTS } from "../../../endpoints"
import { normalize } from "../../../utils/string"
import type { DocenteConUsuario, DocenteCreateDTO, DocenteUpdateDTO } from "../../../domain/docentes/types"

export class DocenteApiRepository extends ApiRepository<DocenteConUsuario> {
  constructor() { super(ENDPOINTS.DOCENTES) }

  private async handle<R>(res: Response): Promise<R> {
    if (!res.ok) throw new Error(`Error ${res.status}: ${(await res.text()) || res.statusText}`)
    return res.json()
  }

  async createFromDTO(input: DocenteCreateDTO) {
    const body: any = {
      nombre: normalize(input.nombre),
      email: input.email.toLowerCase(),
      activo: input.activo ?? true,
      departamento: normalize(input.departamento),
    }
    return super.create(body)
  }

  async updateFromDTO(id: number, input: DocenteUpdateDTO) {
    const patch: any = {}
    if (input.nombre !== undefined) patch.nombre = normalize(input.nombre)
    if (input.email !== undefined) patch.email = input.email.toLowerCase()
    if (input.activo !== undefined) patch.activo = input.activo
    if (input.departamento !== undefined) patch.departamento = normalize(input.departamento)
    return super.update(id, patch)
  }

  async search(term: string): Promise<DocenteConUsuario[]> {
    const q = normalize(term)
    const res = await fetch(`${this.endpoint}?search=${encodeURIComponent(q)}`, { headers: this.getHeaders() })
    return this.handle<DocenteConUsuario[]>(res)
  }
}
