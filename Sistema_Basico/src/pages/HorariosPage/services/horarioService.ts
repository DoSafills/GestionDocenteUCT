import { HorarioRepository } from "../repository/horarioRepository";
import type { HorarioDetalle, FiltrosHorario, EstadisticasHorarios } from "../types/horario";

export class HorarioService {
  private repository: HorarioRepository;

  constructor() {
    this.repository = new HorarioRepository();
  }

  async obtenerHorariosPorSeccion(seccionId: string): Promise<HorarioDetalle[]> {
    try {
      const horariosCompletos = this.repository.obtenerPorSeccionId(seccionId);
      return horariosCompletos.map(horario => this.repository.transformarADetalle(horario));
    } catch (error) {
      console.error('Error al obtener horarios por sección:', error);
      throw new Error('No se pudieron obtener los horarios de la sección');
    }
  }

  async obtenerHorarioPorClase(claseId: string): Promise<HorarioDetalle | null> {
    try {
      const horarioCompleto = this.repository.obtenerPorClaseId(claseId);
      return horarioCompleto ? this.repository.transformarADetalle(horarioCompleto) : null;
    } catch (error) {
      console.error('Error al obtener horario por clase:', error);
      throw new Error('No se pudo obtener el horario de la clase');
    }
  }

  async obtenerHorariosPorDocente(docenteRut: string): Promise<HorarioDetalle[]> {
    try {
      const horariosCompletos = this.repository.obtenerPorDocenteRut(docenteRut);
      return horariosCompletos.map(horario => this.repository.transformarADetalle(horario));
    } catch (error) {
      console.error('Error al obtener horarios por docente:', error);
      throw new Error('No se pudieron obtener los horarios del docente');
    }
  }

  async obtenerHorariosPorBloque(bloqueId: string): Promise<HorarioDetalle[]> {
    try {
      const horariosCompletos = this.repository.obtenerPorBloqueId(bloqueId);
      return horariosCompletos.map(horario => this.repository.transformarADetalle(horario));
    } catch (error) {
      console.error('Error al obtener horarios por bloque:', error);
      throw new Error('No se pudieron obtener los horarios del bloque');
    }
  }

  async filtrarHorarios(filtros: FiltrosHorario): Promise<HorarioDetalle[]> {
    try {
      const horariosCompletos = this.repository.filtrar(filtros);
      return horariosCompletos.map(horario => this.repository.transformarADetalle(horario));
    } catch (error) {
      console.error('Error al filtrar horarios:', error);
      throw new Error('No se pudieron filtrar los horarios');
    }
  }

  async obtenerEstadisticas(): Promise<EstadisticasHorarios> {
    try {
      const todosLosHorarios = this.repository.filtrar({});
      
      const estadisticas: EstadisticasHorarios = {
        totalClases: todosLosHorarios.length,
        clasesPorEstado: {},
        clasesPorDia: {}
      };

      todosLosHorarios.forEach(horario => {
        const estado = horario.clase.estado;
        const dia = horario.bloque.dia_semana.toString();
        
        estadisticas.clasesPorEstado[estado] = (estadisticas.clasesPorEstado[estado] || 0) + 1;
        estadisticas.clasesPorDia[dia] = (estadisticas.clasesPorDia[dia] || 0) + 1;
      });

      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error('No se pudieron obtener las estadísticas');
    }
  }
}