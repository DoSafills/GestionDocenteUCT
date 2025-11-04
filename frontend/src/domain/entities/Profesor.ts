export interface Profesor {
  id: string;
  nombre: string;
  estado: "activo" | "inactivo";
  especialidad: string;
  disponibilidad: {
    dias: string[]; // ejemplo: ["Lunes","Martes"...]
  };
}
