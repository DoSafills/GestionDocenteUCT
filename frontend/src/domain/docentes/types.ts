import type { UserDTO } from "../users/types"

export interface DocenteDTO {
  user_id: number
  departamento: string
}

export type DocenteConUsuario = UserDTO & { docente: DocenteDTO }

export type DocenteCreateDTO = {
  nombre: string
  email: string
  departamento: string
  activo?: boolean
}

export type DocenteUpdateDTO = Partial<DocenteCreateDTO>
