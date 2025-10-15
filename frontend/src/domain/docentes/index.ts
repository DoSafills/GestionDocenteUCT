import { BaseEntity } from "../entities/BaseEntity"
import type { DocenteDTO } from "./types"

export class Docente extends BaseEntity<DocenteDTO> {
  get user_id() { return this.data.user_id }
  get departamento() { return this.data.departamento }
  setDepartamento(dep: string) { this.data.departamento = dep }
}
