import { BaseEntity } from "@/domain/entities/BaseEntity"
import type { DocenteDTO, DocenteConUsuario } from "./types"

export class Docente extends BaseEntity<DocenteDTO> {
  get user_id() { return this.data.user_id }
  get departamento() { return this.data.departamento }
  setDepartamento(dep: string) { this.data.departamento = dep }
}
export class DocenteUsuario extends BaseEntity<DocenteConUsuario> {
  get id(): number {
    return (this.data as any).id ?? (this.data as any).user_id
  }

  get nombre() { return this.data.nombre }
  get email() { return this.data.email }
  get activo() { return this.data.activo }
  get departamento(): string {

    const d = (this.data as any).docente?.departamento ?? (this.data as any).docente_info?.departamento
    return d ?? ""
  }

  toDTO(): DocenteConUsuario {
    const raw: any = this.data
    const id = raw.id ?? raw.user_id
    const docente = raw.docente ?? (
      raw.docente_info
        ? { user_id: id, departamento: raw.docente_info.departamento }
        : { user_id: id, departamento: "" }
    )

    return {
      id,
      nombre: raw.nombre,
      email: raw.email,
      rol: raw.rol,
      activo: raw.activo,
      created_at: raw.created_at ?? "",
      updated_at: raw.updated_at ?? "",
      docente,
      user_id: raw.user_id,
      docente_info: raw.docente_info,
    }
  }
}
