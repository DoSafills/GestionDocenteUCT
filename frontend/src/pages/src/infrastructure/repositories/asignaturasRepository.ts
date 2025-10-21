import { asignaturasMock } from "../../data/mock-data";
import type { Asignatura } from "../../types";

export const asignaturasRepository = {
  async getAll(): Promise<Asignatura[]> {
    return asignaturasMock;
  },

  async getProgramadasCount(): Promise<number> {
    return asignaturasMock.filter((a) => a.estado === "programada").length;
  },
};
