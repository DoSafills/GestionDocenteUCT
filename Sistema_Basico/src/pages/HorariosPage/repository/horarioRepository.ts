import { clasesMock, seccionesMock, bloquesMock, edificiosMock, profesoresMock, asignaturasMock } from "../../../data/mock-data";
import type { HorarioCompleto, HorarioDetalle, FiltrosHorario } from "../types/horario";

export class HorarioRepository {
  
  obtenerPorSeccionId(seccionId: string): HorarioCompleto[] {
    const clases = clasesMock.filter(clase => 
      clase.seccion_id === seccionId || 
      clase.seccion_id?.includes(seccionId)
    );
    return this.construirHorariosCompletos(clases);
  }

  obtenerPorClaseId(claseId: string): HorarioCompleto | null {
    const clase = clasesMock.find(c => c.clase_id === claseId);
    if (!clase) return null;
    
    const horariosCompletos = this.construirHorariosCompletos([clase]);
    return horariosCompletos[0] || null;
  }

  obtenerPorDocenteRut(docenteRut: string): HorarioCompleto[] {
    const clases = clasesMock.filter(clase => 
      clase.docente_rut === docenteRut ||
      clase.docente_rut?.includes(docenteRut.replace(/\D/g, ''))
    );
    return this.construirHorariosCompletos(clases);
  }

  obtenerPorBloqueId(bloqueId: string): HorarioCompleto[] {
    const clases = clasesMock.filter(clase => clase.bloque_id === bloqueId);
    return this.construirHorariosCompletos(clases);
  }

  filtrar(filtros: FiltrosHorario): HorarioCompleto[] {
    let clasesFiltradas = [...clasesMock];

    if (filtros.seccionId) {
      clasesFiltradas = clasesFiltradas.filter(c => 
        c.seccion_id?.includes(filtros.seccionId!) ||
        c.seccion_id === filtros.seccionId
      );
    }
    
    if (filtros.docenteRut) {
      clasesFiltradas = clasesFiltradas.filter(c => 
        c.docente_rut === filtros.docenteRut ||
        c.docente_rut?.includes(filtros.docenteRut!.replace(/\D/g, ''))
      );
    }
    
    if (filtros.salaId) {
      clasesFiltradas = clasesFiltradas.filter(c => 
        c.sala_codigo?.includes(filtros.salaId!) ||
        c.sala_codigo === filtros.salaId
      );
    }
    
    if (filtros.bloqueId) {
      clasesFiltradas = clasesFiltradas.filter(c => c.bloque_id === filtros.bloqueId);
    }
    
    if (filtros.estado) {
      clasesFiltradas = clasesFiltradas.filter(c => c.estado === filtros.estado);
    }

    return this.construirHorariosCompletos(clasesFiltradas);
  }

  private construirHorariosCompletos(clases: any[]): HorarioCompleto[] {
    return clases.map(clase => {
      const seccion = seccionesMock.find(s => s.seccion_id === clase.seccion_id);
      const bloque = bloquesMock.find(b => b.bloque_id === clase.bloque_id);
      const docente = profesoresMock.find(d => d.docente_rut === clase.docente_rut);
      
      const todasLasSalas = edificiosMock.flatMap(edificio => 
        edificio.salas.map(sala => ({ ...sala, edificio }))
      );
      const sala = todasLasSalas.find(s => s.codigo === clase.sala_codigo);
      
      const asignatura = asignaturasMock.find(a => a.codigo === seccion?.asignatura_codigo);

      return {
        clase,
        seccion: seccion!,
        bloque: bloque!,
        sala: sala!,
        docente: docente!,
        asignatura: asignatura!
      };
    }).filter(horario => 
      horario.seccion && horario.bloque && horario.sala && horario.docente && horario.asignatura
    );
  }

  transformarADetalle(horarioCompleto: HorarioCompleto): HorarioDetalle {
    const diasSemana = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    return {
      id: horarioCompleto.clase.id,
      clase_id: horarioCompleto.clase.clase_id,
      titulo: `${horarioCompleto.asignatura.nombre} - ${horarioCompleto.seccion.numero}`,
      seccion: {
        numero: horarioCompleto.seccion.numero,
        codigo: horarioCompleto.seccion.codigo,
        asignatura_codigo: horarioCompleto.seccion.asignatura_codigo
      },
      horario: {
        dia: diasSemana[horarioCompleto.bloque.dia_semana],
        hora_inicio: horarioCompleto.bloque.hora_inicio,
        hora_fin: horarioCompleto.bloque.hora_fin
      },
      sala: {
        codigo: horarioCompleto.sala.codigo,
        numero: horarioCompleto.sala.numero,
        edificio: (horarioCompleto.sala as any).edificio?.codigo || horarioCompleto.sala.edificio_codigo,
        capacidad: horarioCompleto.sala.capacidad
      },
      docente: {
        rut: horarioCompleto.docente.docente_rut,
        nombre: `${horarioCompleto.docente.nombre} ${horarioCompleto.docente.apellido || ''}`,
        email: horarioCompleto.docente.email
      },
      estado: horarioCompleto.clase.estado
    };
  }
}