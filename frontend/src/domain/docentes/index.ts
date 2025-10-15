import { BaseEntity } from "@/domain/entities/BaseEntity"
import type { DocenteDTO } from "./types"
export class Docente extends BaseEntity<DocenteDTO> {
  get user_id() { return this.data.user_id }
  get departamento() { return this.data.departamento }

  setDepartamento(dep: string) {
    this.data.departamento = dep
  }
}

import type { DocenteConUsuario } from "./types"
export class DocenteUsuario extends BaseEntity<DocenteConUsuario> {
  get nombre() { return this.data.nombre }
  get email() { return this.data.email }
  get activo() { return this.data.activo }
  get departamento() { return this.data.docente?.departamento ?? "" }
}
