import type { RestriccionAcademica } from "../../types";

export class RestriccionesMockRepository {
  private data: RestriccionAcademica[];

  constructor(initialData: RestriccionAcademica[]) {
    this.data = [...initialData];
  }

  private wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async getAll(): Promise<RestriccionAcademica[]> {
    await this.wait(200);
    return structuredClone(this.data);
  }

  async getById(id: string): Promise<RestriccionAcademica> {
    await this.wait(200);
    const found = this.data.find(r => r.id === id);
    if (!found) throw new Error(`Restricción con id ${id} no encontrada`);
    return structuredClone(found);
  }

  async create(item: Omit<RestriccionAcademica, "id" | "fechaCreacion" | "creadoPor">): Promise<RestriccionAcademica> {
    await this.wait(200);
    const newItem: RestriccionAcademica = {
      ...item,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString().split("T")[0],
      creadoPor: "admin"
    };
    this.data.push(newItem);
    return structuredClone(newItem);
  }

  async update(id: string, item: Partial<Omit<RestriccionAcademica, "id" | "fechaCreacion" | "creadoPor">>): Promise<RestriccionAcademica> {
    await this.wait(200);
    const index = this.data.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Restricción con id ${id} no encontrada`);
    this.data[index] = { ...this.data[index], ...item };
    return structuredClone(this.data[index]);
  }

  async delete(id: string): Promise<void> {
    await this.wait(200);
    this.data = this.data.filter(r => r.id !== id);
  }

  async toggleEstado(id: string): Promise<RestriccionAcademica | undefined> {
    await this.wait(200);
    const r = this.data.find(r => r.id === id);
    if (r) r.activa = !r.activa;
    return structuredClone(r);
  }
}
