import { profesoresMock } from "../../data/mock-data";
import type { Profesor } from "../../types";

export const profesoresRepository = {
  async getAll(): Promise<Profesor[]> {
    return profesoresMock;
  },

  async getActiveCount(): Promise<number> {
    return profesoresMock.filter((p) => p.estado === "activo").length;
  },
};
