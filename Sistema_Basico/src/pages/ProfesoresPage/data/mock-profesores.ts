// src/mocks/profesoresMock.ts
import type { RestriccionHorario } from "../../../types";
import type { Docente } from "../types";

export const profesoresMock: Docente[] = [
  {
    id: 1,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@universidad.edu",
    password_hash: "",
    esta_activo: true,
    especialidad: "Matemáticas, Álgebra",
  },
  {
    id: 2,
    nombre: "María González",
    email: "maria.gonzalez@universidad.edu",
    password_hash: "",
    esta_activo: true,
    especialidad: "Programación, Bases de Datos",
  },
  {
    id: 3,
    nombre: "Ana López",
    email: "ana.lopez@universidad.edu",
    password_hash: "",
    esta_activo: true,
    especialidad: "Física",
  },
  {
    id: 4,
    nombre: "Roberto Silva",
    email: "roberto.silva@universidad.edu",
    password_hash: "",
    esta_activo: true,
    especialidad: "Química",
  },
  {
    id: 5,
    nombre: "Laura Martínez",
    email: "laura.martinez@universidad.edu",
    password_hash: "",
    esta_activo: false,
    especialidad: "Estadística",
  },
];

// Mock de disponibilidad de cada profesor (RestriccionHorario)
export const restriccionesMock: RestriccionHorario[] = [
  // Carlos: lunes–viernes 08:00–12:00
  { id: 101, docente_id: 1, dia_semana: "LUNES", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Mañana", esta_activa: true },
  { id: 102, docente_id: 1, dia_semana: "MARTES", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Mañana", esta_activa: true },
  { id: 103, docente_id: 1, dia_semana: "MIERCOLES", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Mañana", esta_activa: true },
  { id: 104, docente_id: 1, dia_semana: "JUEVES", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Mañana", esta_activa: true },
  { id: 105, docente_id: 1, dia_semana: "VIERNES", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Mañana", esta_activa: true },

  // María: lunes, miércoles y viernes 14:00–18:00
  { id: 201, docente_id: 2, dia_semana: "LUNES", hora_inicio: "14:00", hora_fin: "18:00", esta_disponible: true, descripcion: "Tarde", esta_activa: true },
  { id: 202, docente_id: 2, dia_semana: "MIERCOLES", hora_inicio: "14:00", hora_fin: "18:00", esta_disponible: true, descripcion: "Tarde", esta_activa: true },
  { id: 203, docente_id: 2, dia_semana: "VIERNES", hora_inicio: "14:00", hora_fin: "18:00", esta_disponible: true, descripcion: "Tarde", esta_activa: true },

  // Ana: martes y jueves 10:00–13:00
  { id: 301, docente_id: 3, dia_semana: "MARTES", hora_inicio: "10:00", hora_fin: "13:00", esta_disponible: true, descripcion: "Media mañana", esta_activa: true },
  { id: 302, docente_id: 3, dia_semana: "JUEVES", hora_inicio: "10:00", hora_fin: "13:00", esta_disponible: true, descripcion: "Media mañana", esta_activa: true },

  // Roberto: sábado 08:00–12:00
  { id: 401, docente_id: 4, dia_semana: "SABADO", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Sábado matutino", esta_activa: true },

  // Laura (inactiva): lunes–miércoles 08:00–12:00
  { id: 501, docente_id: 5, dia_semana: "LUNES", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Mañana", esta_activa: true },
  { id: 502, docente_id: 5, dia_semana: "MARTES", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Mañana", esta_activa: true },
  { id: 503, docente_id: 5, dia_semana: "MIERCOLES", hora_inicio: "08:00", hora_fin: "12:00", esta_disponible: true, descripcion: "Mañana", esta_activa: true },
];
