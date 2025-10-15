import React from "react";
import {
  BookOpen,
  Shield,
  Clock,
  Users,
  Calendar,
  AlertTriangle,
} from "lucide-react";

// 🔹 Tipos posibles de restricción (se pueden ampliar fácilmente)
export type IconType =
  | "prerrequisito"
  | "secuencia_temporal"
  | "sala_prohibida"
  | "profesor_especialidad"
  | "horario_conflicto"
  | "capacidad"
  | "desconocido"; // opcional para fallback

// 🔹 Mapa de iconos por tipo de restricción
const iconMap: Record<IconType, React.ReactElement> = {
  prerrequisito: <BookOpen className="w-4 h-4" />,
  secuencia_temporal: <Clock className="w-4 h-4" />,
  sala_prohibida: <Shield className="w-4 h-4" />,
  profesor_especialidad: <Users className="w-4 h-4" />,
  horario_conflicto: <Calendar className="w-4 h-4" />,
  capacidad: <AlertTriangle className="w-4 h-4" />,
  desconocido: <AlertTriangle className="w-4 h-4" />,
};

// 🔹 Devuelve el icono correspondiente al tipo
export const getTipoIcon = (tipo: IconType): React.ReactElement => {
  return iconMap[tipo] ?? iconMap["desconocido"];
};

// 🔹 Devuelve la clase CSS según prioridad
export const getPrioridadColor = (prioridad: string): string => {
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

// 🔹 Convierte un código de asignatura en su nombre
export const getAsignaturaNombre = (codigo: string): string => {
  // En el futuro podrías mapear códigos → nombres desde un servicio o contexto
  return codigo.trim().toUpperCase();
};

// 🔹 Lista de días de la semana (para selects o formularios)
export const diasSemana = [
  { valor: "lunes", nombre: "Lunes" },
  { valor: "martes", nombre: "Martes" },
  { valor: "miercoles", nombre: "Miércoles" },
  { valor: "jueves", nombre: "Jueves" },
  { valor: "viernes", nombre: "Viernes" },
  { valor: "sabado", nombre: "Sábado" },
  { valor: "domingo", nombre: "Domingo" },
];
