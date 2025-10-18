export interface UserDTO {
  id: number
  nombre: string
  email: string
  rol: "docente" | "estudiante" | "administrador"
  activo: boolean
  created_at: string
  updated_at: string
}
