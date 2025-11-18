import { MockRepository } from "@/infraestructure/repositories/MockRepository";
import type { DocenteConUsuario, DocenteCreateDTO, DocenteUpdateDTO } from "@/domain/docentes/types";
import { docentesMock } from "@/data/docentes";
import { normalize } from "@/utils/string";

export class DocenteMockRepository extends MockRepository<DocenteConUsuario> {
  constructor() { super(docentesMock); }

  async createFromDTO(input: DocenteCreateDTO) {
    const now = new Date().toISOString();
    const payload: Omit<DocenteConUsuario,"id"> = {
      nombre: normalize(input.nombre),
      email: input.email.toLowerCase(),
      rol: "docente",
      activo: input.activo ?? true,
      created_at: now,
      updated_at: now,
      docente: { user_id: 0, departamento: normalize(input.departamento) },
    };
    const created = await super.create(payload as any);
    if (created.docente.user_id !== created.id) {
      created.docente.user_id = created.id;
      return super.update(created.id, created as any);
    }
    return created;
  }

  async updateFromDTO(idUser: number, input: DocenteUpdateDTO) {
    const current = await this.getById(idUser);
    const patch: Partial<Omit<DocenteConUsuario,"id">> = {
      ...(input.nombre !== undefined ? { nombre: normalize(input.nombre) } : {}),
      ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
      ...(input.activo !== undefined ? { activo: input.activo } : {}),
      ...(input.departamento !== undefined
        ? { docente: { ...current.docente, departamento: normalize(input.departamento) } }
        : {}),
      updated_at: new Date().toISOString(),
    };
    return super.update(idUser, patch as any);
  }

  async search(term: string): Promise<DocenteConUsuario[]> {
    const q = normalize(term);
    const all = await this.getAll();
    return all.filter(d =>
      normalize(d.nombre).includes(q) ||
      normalize(d.docente.departamento).includes(q) ||
      normalize(d.email).includes(q)
    );
  }
}
