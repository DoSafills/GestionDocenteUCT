// frontend/src/application/services/AuthService.ts
import { ENDPOINTS } from "@/infraestructure/endpoints";
import { getAccessTokenRepo, logoutRepo } from "@/pages/LoginPage/repository/authRepository";

export type Rol = "ADMINISTRADOR" | "DOCENTE" | "ESTUDIANTE";
export interface UsuarioActual {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  rol: Rol;
}

type Suscriptor = (user: UsuarioActual | null) => void;

function mapRol(raw: string | undefined | null): Rol {
  if (!raw) return "ESTUDIANTE";
  const r = String(raw).toLowerCase();
  if (r === "administrador" || r === "admin" || r === "administrator") return "ADMINISTRADOR";
  if (r === "docente" || r === "teacher" || r === "profesor") return "DOCENTE";
  return "ESTUDIANTE";
}

function inferRolFromEmail(email: string | undefined | null): Rol {
  if (!email) return "ESTUDIANTE";
  const e = String(email).toLowerCase();
  if (e.endsWith("@admin.uct.cl") || e.endsWith(".admin@uct.cl")) return "ADMINISTRADOR";
  if (e.endsWith("@alu.uct.cl") || e.endsWith(".alu@uct.cl")) return "ESTUDIANTE";
  if (e.endsWith("@uct.cl")) return "DOCENTE";
  return "ESTUDIANTE";
}

const MOCK_USER: UsuarioActual = {
  id: 999,
  nombre: "Usuario Mock",
  email: "mock@example.com",
  activo: true,
  rol: "ESTUDIANTE",
};

export class AuthService {
  private usuario: UsuarioActual | null = null;
  private subs: Set<Suscriptor> = new Set();
  private isMockMode: boolean;

  constructor() {
    this.isMockMode = import.meta.env.VITE_AUTH_MOCK === "true";
  }

  onChange(cb: Suscriptor): () => void {
    this.subs.add(cb);
    return () => {
      this.subs.delete(cb);
    };
  }

  private notify() {
    for (const cb of this.subs) cb(this.usuario);
  }

  private setUsuario(u: UsuarioActual | null) {
    this.usuario = u;
    this.notify();
  }

  getUsuarioActual(): UsuarioActual | null {
    return this.usuario;
  }

  isAutenticado(): boolean {
    return this.usuario != null;
  }

  getRol(): Rol | null {
    return this.usuario?.rol ?? null;
  }

  hasRol(rol: Rol): boolean {
    return this.usuario?.rol === rol;
  }

  isMock(): boolean {
    return this.isMockMode;
  }

  cambiarRolMock(rol: Rol) {
    if (!this.isMockMode) {
      console.warn("cambiarRolMock solo funciona en modo mock");
      return;
    }

    if (!this.usuario) {
      console.warn("No hay usuario cargado");
      return;
    }

    this.setUsuario({
      ...this.usuario,
      rol,
    });
  }

  // Permisos para UI
  canCreateProfesores(): boolean {
    return this.usuario?.rol === "ADMINISTRADOR";
  }
  canEditProfesores(): boolean {
    return this.usuario?.rol === "ADMINISTRADOR" || this.usuario?.rol === "DOCENTE";
  }
  canDeleteProfesores(): boolean {
    return this.usuario?.rol === "ADMINISTRADOR";
  }

  async cargarUsuarioDesdeApi(): Promise<UsuarioActual | null> {
    if (this.isMockMode) {
      const mockUser = { ...MOCK_USER };
      this.setUsuario(mockUser);
      return mockUser;
    }

    const { token } = getAccessTokenRepo();
    if (!token) {
      this.setUsuario(null);
      return null;
    }

    try {
      const res = await fetch(ENDPOINTS.AUTH_ME, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          logoutRepo();
        }
        this.setUsuario(null);
        return null;
      }

      const data = await res.json();

      const rawRol = data?.rol ?? data?.role ?? null;
      const rol = rawRol ? mapRol(rawRol) : inferRolFromEmail(data?.email);

      const user: UsuarioActual = {
        id: Number(data.id),
        nombre: String(data.nombre ?? data.name ?? ""),
        email: String(data.email ?? ""),
        activo: !!data.activo,
        rol,
      };

      this.setUsuario(user);
      return user;
    } catch (error) {
      console.error("Error cargando usuario:", error);
      this.setUsuario(null);
      return null;
    }
  }

  clear() {
    this.setUsuario(null);
  }
}

export const authService = new AuthService();
