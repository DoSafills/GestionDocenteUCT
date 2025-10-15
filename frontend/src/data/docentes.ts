import type { DocenteConUsuario } from "@/domain/docentes/types"

export const docentesMock: DocenteConUsuario[] = [
  {
    id: 201,
    nombre: "Ana Pérez",
    email: "ana.perez@universidad.edu",
    rol: "docente",
    activo: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    docente: {
      user_id: 201,
      departamento: "Matemáticas",
    },
  },
  {
    id: 202,
    nombre: "Luis García",
    email: "luis.garcia@universidad.edu",
    rol: "docente",
    activo: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    docente: {
      user_id: 202,
      departamento: "Física",
    },
  },
  {
    id: 203,
    nombre: "María López",
    email: "maria.lopez@universidad.edu",
    rol: "docente",
    activo: false,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    docente: {
      user_id: 203,
      departamento: "Historia",
    },
  },
  {
    id: 204,
    nombre: "Carlos Sánchez",
    email: "carlos.sanchez@universidad.edu",
    rol: "docente",
    activo: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    docente: {
      user_id: 204,
      departamento: "Lengua y Literatura",
    },
  },
  {
    id: 205,
    nombre: "Elena Torres",
    email: "elena.torres@universidad.edu",
    rol: "docente",
    activo: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    docente: {
      user_id: 205,
      departamento: "Biología",
    },
  },
  {
    id: 210,
    nombre: "José Martínez",
    email: "jose.martinez@universidad.edu",
    rol: "docente",
    activo: false,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    docente: {
      user_id: 210,
      departamento: "Química",
    },
  },
]
