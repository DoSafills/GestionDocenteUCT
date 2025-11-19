import { HorarioRepository } from "@/infraestructure/repositories/horarioRepository";
import type { HorarioDetalle, FiltrosHorario } from "@/pages/HorariosPage/types/horario";
import { authService } from "./AuthService";

/**
 * Servicio de aplicación para Horarios
 * Aplica filtros según los permisos del usuario autenticado
 */
export class HorarioService {
  private repository: HorarioRepository;

  constructor(horarioRepository?: HorarioRepository) {
    this.repository = horarioRepository || new HorarioRepository();
  }

  /**
   * Filtra horarios según los permisos del usuario autenticado
   */
  private filtrarPorPermisos(horarios: HorarioDetalle[]): HorarioDetalle[] {
    const usuario = authService.getUsuarioActual();
    if (!usuario) return horarios;

    const rol = usuario.rol;

    // Administrador puede ver todos
    if (rol === "ADMINISTRADOR") {
      return horarios;
    }

    // Docente solo ve sus propios horarios
    if (rol === "DOCENTE") {
      console.log('[HorarioService] Filtrando para docente ID:', usuario.id);
      console.log('[HorarioService] Total horarios antes del filtro:', horarios.length);
      const filtrados = horarios.filter(h => {
        const docenteId = Number(h.docente?.rut) || Number(h.docente?.id);
        const match = docenteId === usuario.id;
        console.log(`[HorarioService] Horario ${h.clase_id}: docenteId=${docenteId}, usuarioId=${usuario.id}, match=${match}`);
        return match;
      });
      console.log('[HorarioService] Horarios filtrados para docente:', filtrados.length);
      return filtrados;
    }

    // Estudiante solo ve horarios de sus secciones inscritas
    if (rol === "ESTUDIANTE") {
      return horarios;
    }

    return horarios;
  }

  async obtenerHorariosPorSeccion(seccionId: string): Promise<HorarioDetalle[]> {
    const horariosCompletos = this.repository.obtenerPorSeccionId(seccionId);
    const detalles = horariosCompletos.map((h) => this.repository.transformarADetalle(h));
    return this.filtrarPorPermisos(detalles);
  }

  async obtenerHorarioPorClase(claseId: string): Promise<HorarioDetalle | null> {
    const horarioCompleto = this.repository.obtenerPorClaseId(claseId);
    if (!horarioCompleto) return null;
    
    const detalle = this.repository.transformarADetalle(horarioCompleto);
    const filtrados = this.filtrarPorPermisos([detalle]);
    return filtrados.length > 0 ? filtrados[0] : null;
  }

  async obtenerHorariosPorDocente(docenteRut: string): Promise<HorarioDetalle[]> {
    const horariosCompletos = this.repository.obtenerPorDocenteRut(docenteRut);
    const detalles = horariosCompletos.map((h) => this.repository.transformarADetalle(h));
    return this.filtrarPorPermisos(detalles);
  }

  async obtenerHorariosPorBloque(bloqueId: string): Promise<HorarioDetalle[]> {
    const horariosCompletos = this.repository.obtenerPorBloqueId(bloqueId);
    const detalles = horariosCompletos.map((h) => this.repository.transformarADetalle(h));
    return this.filtrarPorPermisos(detalles);
  }

  async filtrarHorarios(filtros: FiltrosHorario): Promise<HorarioDetalle[]> {
    const usuario = authService.getUsuarioActual();
    console.log('[HorarioService] Usuario actual:', usuario);
    console.log('[HorarioService] Filtros originales:', filtros);
    
    // Si es docente, forzar filtro por su ID
    if (usuario?.rol === "DOCENTE") {
      // Usar docenteRut para mantener compatibilidad con el repository
      filtros = { ...filtros, docenteRut: String(usuario.id) };
      console.log('[HorarioService] Filtros con docenteRut:', filtros);
    }
    
    const horariosCompletos = this.repository.filtrar(filtros);
    const detalles = horariosCompletos.map((h) => this.repository.transformarADetalle(h));
    return this.filtrarPorPermisos(detalles);
  }
}
