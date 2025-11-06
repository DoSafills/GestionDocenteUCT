import type { IService } from "@/domain/interfaces/IService";
import type { DocenteConUsuario, DocenteCreateDTO, DocenteUpdateDTO } from "@/domain/docentes/types";
import { DocenteUsuario } from "@/domain/docentes";
import type { IRepository } from "@/domain/repositories/IRepository";
import { DocenteApiRepository } from "@/infraestructure/repositories/docente/DocenteApiRepository";
import { DocenteMockRepository } from "@/infraestructure/repositories/docente/DocenteMockRepository";
import { ENDPOINTS } from "@/endpoints";
import { normalize } from "@/utils/string";

type Repo = IRepository<DocenteConUsuario> & {
  createFromDTO?: (input: DocenteCreateDTO) => Promise<DocenteConUsuario>;
  updateFromDTO?: (id: number, input: DocenteUpdateDTO) => Promise<DocenteConUsuario>;
  search?: (t: string) => Promise<DocenteConUsuario[]>;
};

export class DocenteService implements IService<DocenteUsuario, DocenteConUsuario> {
  private repo: Repo;
  constructor(repo?: IRepository<DocenteConUsuario>) {
    this.repo = (repo as Repo) ?? new DocenteApiRepository(ENDPOINTS.DOCENTES);
  }
  private factory = (dto: DocenteConUsuario) => new DocenteUsuario(dto);

  private parseHttp(e: any): { status?: number; detail?: string } {
    const msg = String(e?.message ?? e ?? "");
    const m = msg.match(/Error\s+(\d{3}):\s*([\s\S]*)$/);
    return m ? { status: Number(m[1]), detail: m[2]?.trim() } : {};
  }

  // -------------------------
  // LECTURAS
  // -------------------------
  async obtenerTodas(): Promise<DocenteUsuario[]> {
    try {
      const list = await this.repo.getAll(true);
      return list.map(this.factory);
    } catch (e: any) {
      const { status } = this.parseHttp(e);
      if (status === 404) return [];
      throw e;
    }
  }

  async obtenerPorId(idUser: number): Promise<DocenteUsuario | undefined> {
    try {
      const dto = await this.repo.getById(idUser);
      return this.factory(dto);
    } catch {
      return undefined;
    }
  }

  // -------------------------
  // CREAR
  // Firma requerida por IService:
  crearNueva(data: Omit<DocenteConUsuario, "id">): Promise<DocenteUsuario>;
  // Conveniencia para tu forma "plana":
  crearNueva(data: DocenteCreateDTO): Promise<DocenteUsuario>;
  async crearNueva(data: any): Promise<DocenteUsuario> {
    try {
      // Si viene en formato plano (DocenteCreateDTO)
      const isPlano =
        typeof data?.departamento === "string" &&
        typeof data?.nombre === "string" &&
        typeof data?.email === "string";

      if (isPlano && typeof this.repo.createFromDTO === "function") {
        const dto = await this.repo.createFromDTO({
          nombre: normalize(data.nombre),
          email: String(data.email).toLowerCase(),
          activo: data.activo ?? true,
          departamento: normalize(data.departamento),
        });
        return this.factory(dto);
      }

      // Caso: formato requerido por IService (Omit<DocenteConUsuario,"id">)
      const payload: Omit<DocenteConUsuario, "id"> = {
        nombre: normalize(data.nombre),
        email: String(data.email).toLowerCase(),
        rol: "docente",
        activo: data.activo ?? true,
        created_at: data.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
        docente: {
          user_id: data.docente?.user_id ?? 0,
          departamento: normalize(
            data.docente?.departamento ?? data.departamento ?? ""
          ),
        },
      };

      const created = await this.repo.create(payload as any);
      return this.factory(created);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 400) throw new Error(detail || "Datos inválidos para crear docente");
      throw e;
    }
  }

  // -------------------------
  // ACTUALIZAR (parcial)
  // Firma requerida por IService:
  actualizar(idUser: number, data: Partial<Omit<DocenteConUsuario, "id">>): Promise<DocenteUsuario>;
  // Conveniencia para tu forma "plana":
  actualizar(idUser: number, data: Partial<DocenteCreateDTO>): Promise<DocenteUsuario>;
  async actualizar(idUser: number, data: any): Promise<DocenteUsuario> {
    try {
      const hasPlanoField =
        "departamento" in (data ?? {}) || "nombre" in (data ?? {}) || "email" in (data ?? {}) || "activo" in (data ?? {});

      if (hasPlanoField && typeof this.repo.updateFromDTO === "function") {
        const dto = await this.repo.updateFromDTO(idUser, {
          ...(data.nombre !== undefined ? { nombre: normalize(data.nombre) } : {}),
          ...(data.email !== undefined ? { email: String(data.email).toLowerCase() } : {}),
          ...(data.activo !== undefined ? { activo: !!data.activo } : {}),
          ...(data.departamento !== undefined ? { departamento: normalize(data.departamento) } : {}),
        });
        return this.factory(dto);
      }

      // Caso: formato requerido por IService (parcial DocenteConUsuario sin id)
      const current = await this.repo.getById(idUser);
      const patch: Partial<Omit<DocenteConUsuario, "id">> = {
        ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
        ...(data.email !== undefined ? { email: String(data.email).toLowerCase() } : {}),
        ...(data.activo !== undefined ? { activo: !!data.activo } : {}),
        ...(data.docente?.departamento !== undefined || data.departamento !== undefined
          ? {
              docente: {
                ...current.docente,
                departamento: normalize(
                  data.docente?.departamento ?? data.departamento ?? current.docente.departamento
                ),
              },
            }
          : {}),
        updated_at: new Date().toISOString(),
      };

      const updated = await this.repo.update(idUser, patch as any);
      return this.factory(updated);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 404) throw new Error(detail || "Docente no encontrado");
      if (status === 405) throw new Error("La actualización de docente no está disponible");
      throw e;
    }
  }

  // -------------------------
  // ELIMINAR
  async eliminar(idUser: number): Promise<void> {
    try {
      await this.repo.delete(idUser);
    } catch (e: any) {
      const { status, detail } = this.parseHttp(e);
      if (status === 404) throw new Error(detail || "Docente no encontrado");
      throw e;
    }
  }

  // -------------------------
  // BUSCAR
  async buscar(term: string): Promise<DocenteUsuario[]> {
    const q = normalize(term);
    if (typeof this.repo.search === "function") {
      const list = await this.repo.search(q);
      return list.map(this.factory);
    }
    const all = await this.repo.getAll(true);
    return all
      .filter(d =>
        normalize(d.nombre).includes(q) ||
        normalize(d.email).includes(q) ||
        normalize(d.docente.departamento).includes(q)
      )
      .map(this.factory);
  }
}

// Puedes inyectar Mock en dev, igual que Campus:
export const docenteService = new DocenteService(new DocenteMockRepository());
