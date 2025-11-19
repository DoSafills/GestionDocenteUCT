// frontend/src/infraestructure/repositories/docente/DocenteApiRepository.ts
import { ApiRepository } from "../ApiRepository";
import { ENDPOINTS } from '../../endpoints';
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
  private usersEndpoint: string;
  private authRegisterEndpoint: string;

  constructor(endpoint: string = ENDPOINTS.DOCENTES) {
    super(endpoint);
    this.usersEndpoint = ENDPOINTS.USERS;
    this.authRegisterEndpoint = ENDPOINTS.AUTH_REGISTER;
  }

  private async ok<R>(res: Response): Promise<R> {
    if (!res.ok) throw new Error(`Error ${res.status}: ${(await res.text()) || res.statusText}`);
    return res.status === 204 ? (undefined as unknown as R) : res.json();
  }

  private getHeadersConAuth(): { Authorization: string; "Content-Type": string } {
    const base = super.getHeaders() as any;
    return { "Content-Type": base["Content-Type"], Authorization: base["Authorization"] };
  }

  private async fetchUsersById(id: number) {
    const r = await fetch(`${this.usersEndpoint}/${id}`, { headers: super.getHeaders() });
    return this.ok<UserRow>(r);
  }

  private async fetchDocentes(): Promise<DocenteRow[]> {
    const r = await fetch(this.endpoint, { headers: super.getHeaders() });
    return this.ok<DocenteRow[]>(r);
  }

  private async fetchDocenteByUserId(userId: number): Promise<DocenteRow> {
    const all = await this.fetchDocentes();
    const row = all.find((d) => d.user_id === userId);
    if (!row) throw new Error("Error 404: Docente no encontrado");
    return row;
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

  async getAll(_forceRefresh = false): Promise<DocenteConUsuario[]> {
    const drows = await this.fetchDocentes();
    const list = await Promise.all(
      drows.map(async (d) => {
        const u = await this.fetchUsersById(d.user_id);
        return u.rol === "docente" ? this.fuse(u, d) : undefined;
      }),
    );
    return list.filter(Boolean) as DocenteConUsuario[];
  }

  async getById(idUser: number): Promise<DocenteConUsuario> {
    const d = await this.fetchDocenteByUserId(idUser);
    const u = await this.fetchUsersById(idUser);
    return this.fuse(u, d);
  }

  async search(term: string): Promise<DocenteConUsuario[]> {
    const q = normalize(term);
    const maybe = await fetch(`${this.usersEndpoint}?rol=docente&search=${encodeURIComponent(q)}`, {
      headers: super.getHeaders(),
    });
    if (maybe.ok) {
      const users = await this.ok<UserRow[]>(maybe);
      const allDoc = await this.fetchDocentes();
      const out: DocenteConUsuario[] = [];
      for (const u of users) {
        const d = allDoc.find((x) => x.user_id === u.id);
        if (d) out.push(this.fuse(u, d));
      }
      return out;
    }
    const all = await this.getAll(true);
    return all.filter(
      (d) =>
        normalize(d.nombre).includes(q) ||
        normalize(d.email).includes(q) ||
        normalize(d.docente.departamento).includes(q),
    );
  }

  async activarUsuario(idUser: number): Promise<void> {
    await this.ok(
      await fetch(`${this.usersEndpoint}/${idUser}/activate`, {
        method: "PATCH",
        headers: super.getHeaders(),
      }),
    );
  }

  async desactivarUsuario(idUser: number): Promise<void> {
    await this.ok(
      await fetch(`${this.usersEndpoint}/${idUser}/deactivate`, {
        method: "PATCH",
        headers: super.getHeaders(),
      }),
    );
  }

  async createFromDTO(input: DocenteCreateDTO): Promise<DocenteConUsuario> {
    const uRes = await fetch(this.authRegisterEndpoint, {
      method: "POST",
      headers: this.getHeadersConAuth(),
      body: JSON.stringify({
        nombre: normalize(input.nombre),
        email: input.email.toLowerCase(),
        rol: input.rol ?? "docente",
        activo: input.activo ?? true,
        contrasena: input.contrasena,
      }),
    });
    const user = await this.ok<UserRow>(uRes);

    const dRes = await fetch(this.endpoint, {
      method: "POST",
      headers: super.getHeaders(),
      body: JSON.stringify({
        user_id: user.id,
        departamento: normalize(input.departamento),
      }),
    });
    const drow = await this.ok<DocenteRow>(dRes);
    return this.fuse(user, drow);
  }

  async updateFromDTO(idUser: number, input: DocenteUpdateDTO): Promise<DocenteConUsuario> {
    const drow = await this.fetchDocenteByUserId(idUser);

    if (input.nombre !== undefined || input.email !== undefined || input.activo !== undefined || input.rol !== undefined) {
      await this.ok<UserRow>(
        await fetch(`${this.usersEndpoint}/${idUser}`, {
          method: "PUT",
          headers: super.getHeaders(),
          body: JSON.stringify({
            ...(input.nombre !== undefined ? { nombre: normalize(input.nombre) } : {}),
            ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
            ...(input.activo !== undefined ? { activo: input.activo } : {}),
            ...(input.rol !== undefined ? { rol: input.rol } : { rol: "docente" }),
          }),
        }),
      );
    }

    if (input.departamento !== undefined) {
      await this.ok<DocenteRow>(
        await fetch(`${this.endpoint}/${drow.id}`, {
          method: "PATCH",
          headers: super.getHeaders(),
          body: JSON.stringify({
            departamento: normalize(input.departamento),
          }),
        }),
      );
    }

    return this.getById(idUser);
  }

  async delete(idUser: number): Promise<void> {
    const drow = await this.fetchDocenteByUserId(idUser);
    const res = await fetch(`${this.endpoint}/${drow.id}`, {
      method: "DELETE",
      headers: super.getHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${(await res.text()) || res.statusText}`);
  }
}
