import {profesoresMock, asignaturasMock, clasesMock, salasMock, bloquesMock} from "../../../data/mock-data";
import type { Profesor, Asignatura, Clase, Sala, Bloque, HorarioManual } from "../../../types";

function findDocenteById(id: string): Profesor | undefined {
  return profesoresMock.find((docente) => docente.id === id);
}

function findAsignaturaByCodigo(codigo: string): Asignatura | undefined {
  return asignaturasMock.find((asignatura) => asignatura.codigo === codigo);
}

function findClaseById(id: string): Clase | undefined {
  return clasesMock.find((clase) => clase.id === id);
}

function findSalaByCodigo(codigo: string): Sala | undefined {
    return salasMock.find((sala) => sala.codigo === codigo);
}

function findBloqueById(id: string): Bloque | undefined {
  return bloquesMock.find((bloque) => bloque.id === id);
}

export const HorarioRepo = {
  getAllHorarios: async (): Promise<HorarioManual[]> => {
    // Simula una llamada a una API o base de datos
    return Promise.resolve(clasesMock.map((clase) => {
      const docente = findDocenteById(clase.docente_rut);
      const asignatura = findAsignaturaByCodigo(clase.asignatura_codigo);
      const sala = findSalaByCodigo(clase.sala_codigo);
      const bloque = findBloqueById(clase.bloque_id);

      if (docente && asignatura && sala && bloque) {
        return {
          id: clase.id,
          docente,
          asignatura,
          sala,
          bloque,
        };
      }

      return null;
    }).filter((item): item is HorarioManual => item !== null));