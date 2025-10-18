import React from "react";
import { BookOpen, Shield, Clock, Users, Calendar, AlertTriangle } from "lucide-react";
import { db as mockDb } from "@data/restricciones"; // 🔹 Mock de base de datos
import type { RestriccionAcademica } from "../../../types";

// 🔹 Tipos posibles de restricción para iconos
export type IconType =
  | "prerrequisito"
  | "secuencia_temporal"
  | "sala_prohibida"
  | "profesor_especialidad"
  | "horario_conflicto"
  | "capacidad"
  | "desconocido";

// 🔹 Mapa de iconos por tipo
const iconMap: Record<IconType, React.ReactElement> = {
  prerrequisito: <BookOpen className="w-4 h-4" />,
  secuencia_temporal: <Clock className="w-4 h-4" />,
  sala_prohibida: <Shield className="w-4 h-4" />,
  profesor_especialidad: <Users className="w-4 h-4" />,
  horario_conflicto: <Calendar className="w-4 h-4" />,
  capacidad: <AlertTriangle className="w-4 h-4" />,
  desconocido: <AlertTriangle className="w-4 h-4" />,
};

// 🔹 Función para obtener icono según tipo
export const getTipoIcon = (tipo: IconType): React.ReactElement =>
  iconMap[tipo] ?? iconMap["desconocido"];

// 🔹 Tipo y función para color de prioridad
export type Prioridad = "alta" | "media" | "baja" | "desconocido";

export const getPrioridadColor = (prioridad: Prioridad | string): string => {
  switch (prioridad.toLowerCase()) {
    case "alta":
      return "bg-red-500 text-white";
    case "media":
      return "bg-yellow-400 text-black";
    case "baja":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

// 🔹 Función para formatear código de asignatura
export const getAsignaturaNombre = (codigo: string): string =>
  codigo.trim().toUpperCase();

// 🔹 Lista de días de la semana
export const diasSemana = [
  { valor: "lunes", nombre: "Lunes" },
  { valor: "martes", nombre: "Martes" },
  { valor: "miercoles", nombre: "Miércoles" },
  { valor: "jueves", nombre: "Jueves" },
  { valor: "viernes", nombre: "Viernes" },
  { valor: "sabado", nombre: "Sábado" },
  { valor: "domingo", nombre: "Domingo" },
];

// 🔹 Mock de asignaturas
export const asignaturasMock = [
  { codigo: "MAT101", nombre: "Matemáticas I", creditos: 4 },
  { codigo: "FIS101", nombre: "Física I", creditos: 4 },
  { codigo: "PROG101", nombre: "Programación I", creditos: 3 },
  { codigo: "QUI101", nombre: "Química I", creditos: 3 },
  { codigo: "HIS101", nombre: "Historia", creditos: 2 },
];

// 🔹 Funciones para interactuar con la base de datos simulada
export const db = mockDb; // 🔹 Exportamos db para que sea accesible

export const getAllRestricciones = async (): Promise<RestriccionAcademica[]> =>
  await db.getAll();

export const createRestriccion = async (
  r: Omit<RestriccionAcademica, "id" | "fechaCreacion" | "creadoPor">
) => await db.create(r);

export const updateRestriccion = async (
  id: string,
  datos: Partial<RestriccionAcademica>
) => await db.update(id, datos);

export const deleteRestriccion = async (id: string) => await db.delete(id);

export const toggleEstadoRestriccion = async (id: string) =>
  await db.toggleEstado(id);
