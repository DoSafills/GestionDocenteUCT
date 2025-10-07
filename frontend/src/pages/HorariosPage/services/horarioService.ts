import { HorarioRepository } from "../repository/horarioRepository";
import type { HorarioDetalle, FiltrosHorario } from "../types/horario";

export class HorarioService {
  private repository: HorarioRepository;

  constructor() {
    this.repository = new HorarioRepository();
  }

  async obtenerHorariosPorSeccion(seccionId: string): Promise<HorarioDetalle[]> {
    const horariosCompletos = this.repository.obtenerPorSeccionId(seccionId);
    return horariosCompletos.map((h) => this.repository.transformarADetalle(h));
  }

  async obtenerHorarioPorClase(claseId: string): Promise<HorarioDetalle | null> {
    const horarioCompleto = this.repository.obtenerPorClaseId(claseId);
    return horarioCompleto ? this.repository.transformarADetalle(horarioCompleto) : null;
  }

  async obtenerHorariosPorDocente(docenteRut: string): Promise<HorarioDetalle[]> {
    const horariosCompletos = this.repository.obtenerPorDocenteRut(docenteRut);
    return horariosCompletos.map((h) => this.repository.transformarADetalle(h));
  }

  async obtenerHorariosPorBloque(bloqueId: string): Promise<HorarioDetalle[]> {
    const horariosCompletos = this.repository.obtenerPorBloqueId(bloqueId);
    return horariosCompletos.map((h) => this.repository.transformarADetalle(h));
  }

  async filtrarHorarios(filtros: FiltrosHorario): Promise<HorarioDetalle[]> {
    const horariosCompletos = this.repository.filtrar(filtros);
    return horariosCompletos.map((h) => this.repository.transformarADetalle(h));
  }
}
