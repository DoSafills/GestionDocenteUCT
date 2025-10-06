import type { RestriccionAcademica } from "../types";

// Array en memoria
let restricciones: RestriccionAcademica[] = [
  {
    id: "1",
    tipo: "prerrequisito",
    descripcion: "Debe cursar Matemáticas I antes de II",
    prioridad: 0.9,
    activa: true,
    mensaje: "No puedes inscribir Matemáticas II sin Matemáticas I",
    asignaturaOrigen: "MAT101",
    asignaturaDestino: "MAT102",
    salaProhibida: "",
    profesorRequerido: "",
    especialidadRequerida: "",
    diaRestriccion: "",
    horaInicioRestriccion: "",
    horaFinRestriccion: "",
    fechaCreacion: "2025-10-04",
    creadoPor: "admin"
  }
];

// Simula un delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  getAll: async () => { await wait(200); return restricciones; },
  create: async (restriccion: RestriccionAcademica) => {
    await wait(200);
    const nueva = { ...restriccion, id: (Date.now()).toString(), fechaCreacion: new Date().toISOString().split("T")[0], creadoPor: "admin" };
    restricciones.push(nueva);
    return nueva;
  },
  update: async (id: string, datos: Partial<RestriccionAcademica>) => {
    await wait(200);
    const index = restricciones.findIndex(r => r.id === id);
    if (index === -1) throw new Error("No encontrada");
    restricciones[index] = { ...restricciones[index], ...datos };
    return restricciones[index];
  },
  delete: async (id: string) => {
    await wait(200);
    restricciones = restricciones.filter(r => r.id !== id);
  },
  toggleEstado: async (id: string) => {
    await wait(200);
    const r = restricciones.find(r => r.id === id);
    if (r) r.activa = !r.activa;
    return r;
  }
};
