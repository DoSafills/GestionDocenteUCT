// frontend/src/infraestructure/repositories/docente/DocenteApiRepository.ts
import { ApiRepository } from "../ApiRepository";
import { ENDPOINTS } from "../../endpoints";
import { normalize } from "../../../utils/string";
import type { DocenteConUsuario, DocenteCreateDTO, DocenteUpdateDTO } from "../../../domain/docentes/types";

type DocenteRow = { id: number; user_id: number; departamento: string };
type UserRow = {
  id: number;
  nombre: string;
  email: string;
  rol: "docente" | "estudiante" | "administrador";
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export class DocenteApiRepository extends ApiRepository<DocenteConUsuario> {
  constructor() {
    super(ENDPOINTS.DOCENTES);
  }

  private async ok<R>(res: Response): Promise<R> {
    if (!res.ok) throw new Error(`Error ${res.status}: ${(await res.text()) || res.statusText}`);
    return res.json();
  }

  private fuse(user: UserRow, drow: DocenteRow): DocenteConUsuario {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo,
      created_at: user.created_at,
      updated_at: user.updated_at,
      docente: { user_id: user.id, departamento: drow.departamento },
      docente_info: { id: drow.id, departamento: drow.departamento },
    };
  }

  private async fetchUser(userId: number): Promise<UserRow> {
    const res = await fetch(`${ENDPOINTS.USERS}/${userId}`, { headers: this.getHeaders() });
    return this.ok<UserRow>(res);
  }

  private async fetchDocente(docenteId: number): Promise<DocenteRow> {
    const res = await fetch(`${ENDPOINTS.DOCENTES}/${docenteId}`, { headers: this.getHeaders() });
    return this.ok<DocenteRow>(res);
  }

  async getAll(_forceRefresh = false): Promise<DocenteConUsuario[]> {
    const r = await fetch(ENDPOINTS.DOCENTES, { headers: this.getHeaders() });
    const drows = await this.ok<DocenteRow[]>(r);

    const out: DocenteConUsuario[] = [];
    await Promise.all(
      drows.map(async (d) => {
        const u = await this.fetchUser(d.user_id);
        if (u.rol === "docente") out.push(this.fuse(u, d));
      })
    );
    return out;
  }

  async getById(docenteId: number): Promise<DocenteConUsuario> {
    const d = await this.fetchDocente(docenteId);
    const u = await this.fetchUser(d.user_id);
    return this.fuse(u, d);
  }

  async search(term: string): Promise<DocenteConUsuario[]> {
    const q = normalize(term);

    const maybe = await fetch(`${ENDPOINTS.USERS}?rol=docente&search=${encodeURIComponent(q)}`, {
      headers: this.getHeaders(),
    });

    if (maybe.ok) {
      const users = await this.ok<UserRow[]>(maybe);
      const allDoc = await this.ok<DocenteRow[]>(
        await fetch(ENDPOINTS.DOCENTES, { headers: this.getHeaders() })
      );
      const out: DocenteConUsuario[] = [];
      for (const u of users) {
        const row = allDoc.find((d) => d.user_id === u.id);
        if (row) out.push(this.fuse(u, row));
      }
      return out;
    }

    const all = await this.getAll(true);
    return all.filter(
      (d) =>
        normalize(d.nombre).includes(q) ||
        normalize(d.email).includes(q) ||
        normalize(d.docente.departamento).includes(q)
    );
  }

  async createFromDTO(input: DocenteCreateDTO): Promise<DocenteConUsuario> {
    const uRes = await fetch(ENDPOINTS.USERS, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        nombre: normalize(input.nombre),
        email: input.email.toLowerCase(),
        rol: "docente",
        activo: input.activo ?? true,
      }),
    });
    const user = await this.ok<UserRow>(uRes);

    // 2)  docente
    const dRes = await fetch(ENDPOINTS.DOCENTES, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        user_id: user.id,
        departamento: normalize(input.departamento),
      }),
    });
    const drow = await this.ok<DocenteRow>(dRes);

    return this.fuse(user, drow);
  }


  async updateFromDTO(idUser: number, input: DocenteUpdateDTO): Promise<DocenteConUsuario> {
    const allDoc = await this.ok<DocenteRow[]>(
      await fetch(ENDPOINTS.DOCENTES, { headers: this.getHeaders() })
    );
    const drow = allDoc.find((d) => d.user_id === idUser);
    if (!drow) throw new Error("Docente no encontrado para este usuario");

    if (input.nombre !== undefined || input.email !== undefined || input.activo !== undefined) {
      await this.ok<UserRow>(
        await fetch(`${ENDPOINTS.USERS}/${idUser}`, {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify({
            ...(input.nombre !== undefined ? { nombre: normalize(input.nombre) } : {}),
            ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
            ...(input.activo !== undefined ? { activo: input.activo } : {}),
            // algunos backends piden rol en PUT:
            rol: "docente",
          }),
        })
      );
    }

    if (input.departamento !== undefined) {
      const putDoc = await fetch(`${ENDPOINTS.DOCENTES}/${drow.id}`, {
        method: "PUT", 
        headers: this.getHeaders(),
        body: JSON.stringify({
          user_id: idUser,
          departamento: normalize(input.departamento),
        }),
      });

      if (!putDoc.ok) {
        throw new Error(`No existe PUT /api/docentes/{id}. Agrega ese endpoint en el backend.`);
      }
      await this.ok<DocenteRow>(putDoc);
    }

    return this.getById(drow.id);
  }


  async delete(idUser: number): Promise<void> {
    const allDoc = await this.ok<DocenteRow[]>(
      await fetch(ENDPOINTS.DOCENTES, { headers: this.getHeaders() })
    );
    const drow = allDoc.find((d) => d.user_id === idUser);
    if (!drow) throw new Error("Docente no encontrado para este usuario");

    const res = await fetch(`${ENDPOINTS.DOCENTES}/${drow.id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${(await res.text()) || res.statusText}`);
  }
}
