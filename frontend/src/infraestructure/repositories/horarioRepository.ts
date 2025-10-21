
// reemplazar por servicios
// USAR IRepository
import { clasesMock } from "@data/clases";
import { seccionesMock } from "@data/secciones";
import { asignaturasMock } from "@data/asignaturas";
import { bloquesMock } from "@data/bloques";
import { edificiosMock } from "@data/edificios";
import { salasMock } from "@data/salas";
import { docentesMock } from "@data/docentes";
import type { HorarioCompleto, HorarioDetalle, FiltrosHorario } from "@types/horario";
 
export class HorarioRepository {
  obtenerPorSeccionId(seccionId: string): HorarioCompleto[] {
    // Acepta id numérico en string
    const clases = clasesMock.filter((clase) => String(clase.seccion_id) === String(seccionId));
    return this.construirHorariosCompletos(clases);
  }

  obtenerPorClaseId(claseId: string): HorarioCompleto | null {
    const clase = clasesMock.find((c) => c.clase_id === claseId);
    if (!clase) return null;
    const completos = this.construirHorariosCompletos([clase]);
    return completos[0] || null;
  }

  // Interpretamos “docenteRut” como docente_id
  obtenerPorDocenteRut(docenteIdAsRut: string): HorarioCompleto[] {
    const clases = clasesMock.filter((clase) => String(clase.docente_id) === String(docenteIdAsRut));
    return this.construirHorariosCompletos(clases);
  }

  obtenerPorBloqueId(bloqueId: string): HorarioCompleto[] {
    const clases = clasesMock.filter((clase) => String(clase.bloque_id) === String(bloqueId));
    return this.construirHorariosCompletos(clases);
  }

  filtrar(filtros: FiltrosHorario): HorarioCompleto[] {
    let clasesFiltradas = [...clasesMock];

    if (filtros.seccionId) {
      // Si es numérico, filtra por id; si no, filtra por código de sección después de construir
      if (/^\d+$/.test(filtros.seccionId)) {
        clasesFiltradas = clasesFiltradas.filter((c) => String(c.seccion_id) === filtros.seccionId);
      }
    }

    if (filtros.docenteRut) {
      clasesFiltradas = clasesFiltradas.filter((c) => String(c.docente_id) === String(filtros.docenteRut));
    }

    if (filtros.salaId) {
      // admite exacto o prefijo de edificio (CJP07)
      clasesFiltradas = clasesFiltradas.filter(
        (c) => c.sala_codigo?.includes(filtros.salaId!) || c.sala_codigo === filtros.salaId
      );
    }

    if (filtros.bloqueId) {
      clasesFiltradas = clasesFiltradas.filter((c) => String(c.bloque_id) === String(filtros.bloqueId));
    }

    if (filtros.estado) {
      clasesFiltradas = clasesFiltradas.filter((c) => c.estado === filtros.estado);
    }

    let completos = this.construirHorariosCompletos(clasesFiltradas);

    // Si seccionId no es numérico pero parece un código (p. ej. "MAT101-01"), filtra por código tras construir
    if (filtros.seccionId && !/^\d+$/.test(filtros.seccionId)) {
      completos = completos.filter((h) => h.seccion.codigo?.includes(filtros.seccionId as string));
    }

    if (typeof filtros.dia === "number") {
      completos = completos.filter((h) => Number((h as any).bloque.dia_semana) === filtros.dia);
    }

    return completos;
  }

  private construirHorariosCompletos(clases: any[]): HorarioCompleto[] {
    // Join salas con edificios (por edificio_id)
    const edifById = new Map(edificiosMock.map((e: any) => [e.id, e]));
    const salasEnriquecidas = salasMock.map((s: any) => {
      const edif = edifById.get(s.edificio_id);
      const edificioNombre = (edif?.nombre ?? "").trim(); // "CJP07 - Ricardo Ferrando"
      const edificioCodigo = (edificioNombre.split(" ")[0] || "").trim(); // "CJP07"
      const numero = (String(s.codigo).split(/[_-]/).pop() || String(s.codigo)).toString();
      return {
        codigo: String(s.codigo),
        numero,
        capacidad: Number(s.capacidad ?? 0),
        edificio: { codigo: edificioCodigo, nombre: edificioNombre },
      };
    });

    return clases
      .map((clase) => {
        // OJO: seccionesMock tiene 'id' (numérico) y 'codigo' (p. ej. "MAT101-01")
        const seccion = seccionesMock.find((s: any) => String(s.id) === String(clase.seccion_id));
        // bloquesMock tiene 'id' numérico
        const bloque = bloquesMock.find((b: any) => String(b.id) === String(clase.bloque_id));
        const docente = docentesMock.find((d: any) => String(d.id) === String(clase.docente_id));

        // Buscar sala por código exacto
        let sala: any = salasEnriquecidas.find((s: any) => s.codigo === clase.sala_codigo);

        // Fallback: prefijo+numero desde "CJP07_101"
        if (!sala && typeof clase.sala_codigo === "string") {
          const match = clase.sala_codigo.match(/^([A-Z]+[0-9]+)[_-]?(\d+)$/i);
          const prefijo = match?.[1] || "";
          const num = match?.[2] || (String(clase.sala_codigo).split(/[_-]/).pop() || "");
          sala = salasEnriquecidas.find(
            (s: any) => (!prefijo || s.edificio.codigo === prefijo) && (!num || String(s.numero) === String(num))
          );
        }

        if (!seccion || !bloque || !docente || !sala) return null;

        // Unir asignatura por id numérico
        const asignatura = asignaturasMock.find((a: any) => String(a.id) === String(seccion.asignatura_id));
        if (!asignatura) return null;

        return {
          clase,
          seccion,
          bloque,
          sala,
          docente,
          asignatura,
        } as HorarioCompleto;
      })
      .filter(Boolean) as HorarioCompleto[];
  }

  transformarADetalle(h: HorarioCompleto): HorarioDetalle {
    const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    // Derivar numero de sección desde el código (p. ej. "MAT101-01" -> "01")
    const seccionCodigo: string = (h as any).seccion.codigo ?? "";
    const seccionNumero: string =
      (seccionCodigo.includes("-") ? seccionCodigo.split("-")[1] : "") || "1";

    return {
      id: String((h as any).clase.id ?? (h as any).clase.clase_id),
      clase_id: String((h as any).clase.clase_id),
      titulo: `${(h as any).asignatura.nombre} - ${seccionNumero}`,
      seccion: {
        numero: seccionNumero,
        codigo: seccionCodigo,
        asignatura_codigo: String((h as any).asignatura.codigo ?? ""),
      },
      horario: {
        dia: dias[Number((h as any).bloque.dia_semana)],
        hora_inicio: String((h as any).bloque.hora_inicio),
        hora_fin: String((h as any).bloque.hora_fin),
      },
      sala: {
        codigo: String((h as any).sala.codigo ?? ""),
        numero: String((h as any).sala.numero ?? ""),
        edificio: String((h as any).sala.edificio?.codigo ?? ""),
        capacidad: Number((h as any).sala.capacidad ?? 0),
      },
      docente: {
        rut: String((h as any).docente.id),   // usamos id como “rut”
        nombre: String((h as any).docente.nombre),
        email: String((h as any).docente.email ?? ""),
      },
      estado: String((h as any).clase.estado ?? "activo"),
    };
  }
}
