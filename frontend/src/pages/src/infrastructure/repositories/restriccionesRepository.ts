import { restriccionesMock } from "../../data/mock-data";
import type { RestriccionAcademica } from "../../types";

export const restriccionesRepository = {
  async getAll(): Promise<RestriccionAcademica[]> {
    return restriccionesMock;
  },

  async getActivasCount(): Promise<number> {
    return restriccionesMock.filter((r) => r.activa).length;
  },

  async getUltimas(limit = 6): Promise<RestriccionAcademica[]> {
    return [...restriccionesMock]
      .sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime()
      )
      .slice(0, limit);
  },
};
