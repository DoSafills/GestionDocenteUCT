import { getAccessTokenRepo, logoutRepo } from "@/pages/LoginPage/repository/authRepository";
import { apiGetMe } from "@/pages/LoginPage/services/authApi";

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

    try {
      const result = await apiGetMe();
      console.log('[AuthService] Resultado de apiGetMe:', result);
      
      if (!result.ok) {
        console.error('[AuthService] Error en apiGetMe:', result.error);
        logoutRepo();
        this.setUsuario(null);
        return null;
      }

      const data = result.value;
      console.log('[AuthService] Datos del usuario:', data);

      const user: UsuarioActual = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        activo: data.activo,
        rol: mapRol(data.rol || data.role || 'ESTUDIANTE'), // Flexibilidad en el campo rol
      };

      this.setUsuario(user);
      return user;
    } catch (error) {
      console.error('[AuthService] Error al cargar usuario:', error);
      logoutRepo();
      this.setUsuario(null);
      return null;
    }
  }

  clear() {
    this.setUsuario(null);
  }
}

export const authService = new AuthService();
