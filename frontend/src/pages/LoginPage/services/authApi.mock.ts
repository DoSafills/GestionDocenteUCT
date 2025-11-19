import type { LoginResponseDto, RefreshResponseDto } from "../types/auth";
import { ok, err } from "../types/result";
import { AuthError } from "../types/auth";

const LATENCY = 400;                     
let CURRENT_ACCESS = "access_mock_1";
let CURRENT_REFRESH = "refresh_mock_1";

// Usuarios demo para mapeo en /auth/me
const USUARIOS_MOCK = {
  "admin@inf.uct.cl": { id: 100, nombre: "Admin Demo", email: "admin@inf.uct.cl", activo: true, rol: "ADMINISTRADOR" },
  "docente@uct.cl": { id: 999, nombre: "Docente Demo", email: "docente@uct.cl", activo: true, rol: "DOCENTE" },
  "estudiante@alu.uct.cl": { id: 300, nombre: "Estudiante Demo", email: "estudiante@alu.uct.cl", activo: true, rol: "ESTUDIANTE" }
};

console.log('[authApi.mock] Usuarios disponibles:', Object.keys(USUARIOS_MOCK));

export async function apiLogin(params: { email: string; password: string }) {
  await new Promise(r => setTimeout(r, LATENCY));
  // Aceptar dominios válidos de UCT: @uct.cl, @alu.uct.cl, @inf.uct.cl
  const validDomains = ["@uct.cl", "@alu.uct.cl", "@inf.uct.cl"];
  const hasValidDomain = validDomains.some(domain => params.email.endsWith(domain));
  if (!hasValidDomain) return err(new AuthError("Correo inválido", "BAD_REQUEST"));
  if (params.password === "fail")   return err(new AuthError("Credenciales inválidas", "UNAUTHORIZED"));

  // expires_in cortito para probar el auto-refresh
  const data: LoginResponseDto = {
    access_token: CURRENT_ACCESS,
    refresh_token: CURRENT_REFRESH,
    token_type: "bearer",
    expires_in: 12, // segundos
    user: {} as any,
  };
  return ok(data);
}

export async function apiRefresh(_: { refresh_token: string }) {
  await new Promise(r => setTimeout(r, LATENCY));
  // simula rotación de token
  CURRENT_ACCESS = "access_mock_" + Math.floor(Math.random() * 10000);
  const data: RefreshResponseDto = { access_token: CURRENT_ACCESS };
  return ok(data);
}

export async function apiGetMe() {
  await new Promise(r => setTimeout(r, LATENCY));
  
  // Obtener el email del localStorage (guardado durante el login)
  const email = localStorage.getItem('mock_login_email');
  console.log('[apiGetMe] Email del login:', email);
  
  if (!email) {
    return err(new AuthError("No hay sesión activa", "UNAUTHORIZED"));
  }
  
  const usuario = USUARIOS_MOCK[email as keyof typeof USUARIOS_MOCK];
  console.log('[apiGetMe] Usuario mapeado:', usuario);
  
  if (!usuario) {
    return err(new AuthError("Usuario no encontrado", "UNAUTHORIZED"));
  }
  
  return ok(usuario);
}
