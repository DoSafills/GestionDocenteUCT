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

function mapRol(raw: string): Rol {
  const r = raw.toLowerCase();
  if (r === "administrador") return "ADMINISTRADOR";
  if (r === "docente") return "DOCENTE";
  return "ESTUDIANTE";
}

export class AuthService {
  private usuario: UsuarioActual | null = null;
  private subs: Set<Suscriptor> = new Set();

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

  async cargarUsuarioDesdeApi(): Promise<UsuarioActual | null> {
    const { token } = getAccessTokenRepo();
    if (!token) {
      this.setUsuario(null);
      return null;
    }

    const res = await fetch(ENDPOINTS.AUTH_ME, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      logoutRepo();
      this.setUsuario(null);
      return null;
    }

    const data = await res.json();

    const user: UsuarioActual = {
      id: data.id,
      nombre: data.nombre,
      email: data.email,
      activo: data.activo,
      rol: mapRol(data.rol),
    };

    this.setUsuario(user);
    return user;
  }

  clear() {
    this.setUsuario(null);
  }
}

export const authService = new AuthService();
