import { edificiosMock } from "../../data/mock-data";
import type { Sala } from "../../types";

export const salasRepository = {
  async getAllSalas(): Promise<Sala[]> {
    return edificiosMock.flatMap((e) => e.salas);
  },

  async getDisponiblesCount(): Promise<number> {
    return edificiosMock.reduce(
      (acc, e) => acc + e.salas.filter((s) => s.disponible).length,
      0
    );
  },

  async getEdificios() {
    return edificiosMock;
  },
};
