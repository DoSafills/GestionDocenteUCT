import type { RestriccionAcademica } from "../../types";
import { MockRepository } from "@/infraestructure/repositories/MockRepository";

const restriccionesIniciales: RestriccionAcademica[] = [
  {
    id: 1,
    tipo: "prerrequisito",
    descripcion: "Debe cursar Matemáticas I antes de II",
    activa: true,
    prioridad: "alta",
    parametros: {
      asignaturaOrigen: "MAT101",
      asignaturaDestino: "MAT102",
      salaProhibida: "",
      docente_rut: "",
      especialidadRequerida: "",
      diaRestriccion: "",
      horaInicioRestriccion: "",
      horaFinRestriccion: "",
    },
    mensaje: "No puedes inscribir Matemáticas II sin Matemáticas I",
    fechaCreacion: "2025-10-04",
    creadoPor: "admin",
  },
];

export class RestriccionAcademicaMockRepository extends MockRepository<RestriccionAcademica> {
  constructor() {
    super(restriccionesIniciales);
  }

  async getAll(): Promise<RestriccionAcademica[]> {
    return structuredClone(this.data);
  }

  async getById(id: number): Promise<RestriccionAcademica> {
    const r = this.data.find((r) => r.id === id);
    if (!r) throw new Error(`Restricción con id ${id} no encontrada`);
    return structuredClone(r);
  }

  async create(r: RestriccionAcademica): Promise<RestriccionAcademica> {
    this.data.push(r);
    return structuredClone(r);
  }

  async update(id: number, cambios: Partial<RestriccionAcademica>): Promise<RestriccionAcademica> {
    const index = this.data.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Restricción con id ${id} no encontrada`);
    this.data[index] = { ...this.data[index], ...cambios };
    return structuredClone(this.data[index]);
  }

  async delete(id: number): Promise<void> {
    const index = this.data.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Restricción con id ${id} no encontrada`);
    this.data.splice(index, 1);
  }

  async toggleEstado(id: number): Promise<RestriccionAcademica> {
    const restriccion = this.data.find((r) => r.id === id);
    if (!restriccion) throw new Error(`Restricción con id ${id} no encontrada`);
    restriccion.activa = !restriccion.activa;
    return structuredClone(restriccion);
  }

  async findByTipo(tipo: string): Promise<RestriccionAcademica[]> {
    return structuredClone(this.data.filter((r) => r.tipo === tipo));
  }

  async findByPrioridad(prioridad: string): Promise<RestriccionAcademica[]> {
    return structuredClone(this.data.filter((r) => r.prioridad === prioridad));
  }

  async search(query: string): Promise<RestriccionAcademica[]> {
    const q = query.toLowerCase();
    return structuredClone(
      this.data.filter(
        (r) =>
          r.descripcion.toLowerCase().includes(q) ||
          r.mensaje.toLowerCase().includes(q)
      )
    );
  }
}

export const db = new RestriccionAcademicaMockRepository();
