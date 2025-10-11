import React from "react";
import { BookOpen, Shield, Clock, Users, Calendar, AlertTriangle } from "lucide-react";

// Todos los tipos de restricción posibles
export type IconType =
  | "prerrequisito"
  | "secuencia_temporal"
  | "sala_prohibida"
  | "profesor_especialidad"
  | "horario_conflicto"
  | "capacidad";

// Función para obtener el icono según el tipo
export const getTipoIcon = (tipo: IconType): React.ReactElement => {
  const iconMap: Record<IconType, React.ReactElement> = {
    prerrequisito: React.createElement(BookOpen, { className: "w-4 h-4" }),
    secuencia_temporal: React.createElement(Clock, { className: "w-4 h-4" }),
    sala_prohibida: React.createElement(Shield, { className: "w-4 h-4" }),
    profesor_especialidad: React.createElement(Users, { className: "w-4 h-4" }),
    horario_conflicto: React.createElement(Calendar, { className: "w-4 h-4" }),
    capacidad: React.createElement(AlertTriangle, { className: "w-4 h-4" }),
  };

  return iconMap[tipo] || React.createElement(AlertTriangle, { className: "w-4 h-4" });
};

// Función para obtener color de prioridad para badges
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

// Función para obtener nombre de asignatura desde código
export const getAsignaturaNombre = (codigo: string): string => {
  return codigo.toUpperCase(); // Temporal: retorna el código como nombre
};

// Días de la semana
export const diasSemana = [
  { valor: 1, nombre: "Lunes" },
  { valor: 2, nombre: "Martes" },
  { valor: 3, nombre: "Miércoles" },
  { valor: 4, nombre: "Jueves" },
  { valor: 5, nombre: "Viernes" },
  { valor: 6, nombre: "Sábado" },
  { valor: 7, nombre: "Domingo" },
];
