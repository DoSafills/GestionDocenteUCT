import type { UserDTO } from "@/domain/users/types"

export interface DocenteDTO {
  id: number
  user_id: number
  departamento: string
}

export type DocenteConUsuario =
  & UserDTO
  & {
      docente: { user_id: number; departamento: string }  // 🔥 obligatorio
      user_id?: number
      docente_info?: { id: number; departamento: string }
    }

export type DocenteCreateDTO = {
  nombre: string
  email: string
  departamento: string
  activo?: boolean
}

export type DocenteUpdateDTO = Partial<DocenteCreateDTO>
