// src/infrastructure/services/dashboard.service.ts

// ===== Tipos =====
export type OcupacionEdificio = {
  id: string | number;
  nombre?: string;
  codigo?: string;
  campus?: string;
  ocupadas: number;
  libres: number;
  totalSalas: number;
};

export type UltimaRestriccion = {
  id: string | number;
  tipo?: string;
  fecha: string;           // YYYY-MM-DD
  descripcion?: string;
};

export type RestriccionTop = {
  tipo: string;
  cantidad: number;
};

export type DashboardStats = {
  // Totales
  docentesTotal: number;
  asignaturasTotal: number;
  edificiosTotal: number;
  salasTotal: number;

  // Ocupación global y por edificio
  ocupacionGlobalPct: number;   // 0..100
  totalOcupadas: number;
  totalLibres: number;
  ocupacionPorEdificio: OcupacionEdificio[];

  // Restricciones
  ultimasRestriccionesSemana: UltimaRestriccion[];
  restriccionesTopTipos: RestriccionTop[]; // Top 4 por "tipo"
};

// Entrada
export type ComputeInput = {
  docentes?: any[];
  salas?: any[];          // { disponible?: boolean, estado?: string, edificioId|edificio|... }
  edificios?: any[];      // opcional: { id, nombre, codigo, campus }
  asignaturas?: any[];    // opcional
  restricciones?: any[];  // opcional: { id, tipo?, fechaCreacion?, descripcion? }
};

// ===== Helpers tolerantes con mocks heterogéneos =====
const edId = (s: any) =>
  s?.edificioId ?? s?.edificio?.id ?? s?.edificio ?? s?.buildingId ?? s?.id_edificio ?? s?.edificio_id ?? "desconocido";

const edNom = (s: any) =>
  s?.edificioNombre ?? s?.edificio?.nombre ?? s?.buildingName ?? undefined;

const edCod = (s: any) =>
  s?.edificioCodigo ?? s?.edificio?.codigo ?? s?.buildingCode ?? undefined;

const edCampus = (s: any) =>
  s?.edificioCampus ?? s?.edificio?.campus ?? s?.campus ?? undefined;

const safeTime = (iso?: string) => {
  const t = Date.parse(iso ?? "");
  return Number.isNaN(t) ? 0 : t;
};
const fmtDate = (iso?: string) => String(iso ?? "").slice(0, 10);
const withinLastDays = (iso?: string, days = 7) => {
  const t = safeTime(iso);
  if (!t) return false;
  const now = Date.now();
  const delta = now - t;
  return delta >= 0 && delta <= days * 24 * 60 * 60 * 1000;
};

// 👇 Lógica corregida para detectar si una sala está OCUPADA
function isOcupadaSala(s: any): boolean {
  // 1) bandera booleana confiable
  if (typeof s?.disponible === "boolean") return s.disponible === false; // false => OCUPADA
  // 2) otras banderas comunes
  if (typeof s?.ocupada === "boolean") return s.ocupada === true;
  if (typeof s?.enUso === "boolean")   return s.enUso === true;
  if (typeof s?.reservada === "boolean") return s.reservada === true;
  // 3) texto en estado
  const txt = String(s?.estado ?? "").toLowerCase().trim();
  if (txt) {
    if (/(ocup|no disponible|en uso|reservad)/.test(txt)) return true;
    if (/(libre|disponible)/.test(txt)) return false;
  }
  // 4) arreglos indicadores
  if (Array.isArray(s?.reservas) && s.reservas.some((r: any) => r?.activa === true)) return true;
  if (Array.isArray(s?.horarios) && s.horarios.some((h: any) => h?.enCurso === true || h?.activa === true)) return true;
  // 5) default conservador: LIBRE
  return false;
}

// ===== Core =====
export function computeDashboardStats(input: ComputeInput): DashboardStats {
  const docentes = input?.docentes ?? [];
  const salas = input?.salas ?? [];
  const edificios = input?.edificios ?? [];
  const asignaturas = input?.asignaturas ?? [];
  const restricciones = input?.restricciones ?? [];

  const docentesTotal = docentes.length;
  const salasTotal = salas.length;
  const asignaturasTotal = asignaturas.length;

  // Precarga por edificio (si mandas el catálogo)
  const byEd = new Map<string | number, OcupacionEdificio>();
  for (const e of edificios) {
    const id = e?.id ?? Math.random().toString(36).slice(2, 9);
    byEd.set(id, {
      id,
      nombre: e?.nombre,
      codigo: e?.codigo,
      campus: e?.campus,
      ocupadas: 0,
      libres: 0,
      totalSalas: 0,
    });
  }

  // Cuenta salas por edificio
  for (const s of salas) {
    const id = edId(s);
    const row = byEd.get(id) ?? {
      id,
      nombre: edNom(s),
      codigo: edCod(s),
      campus: edCampus(s),
      ocupadas: 0,
      libres: 0,
      totalSalas: 0,
    };

    row.totalSalas += 1;
    if (isOcupadaSala(s)) row.ocupadas += 1;
    else row.libres += 1;

    // completa metadatos si faltaban
    row.nombre ??= edNom(s);
    row.codigo ??= edCod(s);
    row.campus ??= edCampus(s);

    byEd.set(id, row);
  }

  const ocupacionPorEdificio = Array.from(byEd.values());
  const edificiosTotal = ocupacionPorEdificio.length;

  // Global
  let totalOcupadas = 0, totalLibres = 0;
  for (const e of ocupacionPorEdificio) { totalOcupadas += e.ocupadas; totalLibres += e.libres; }
  const ocupacionGlobalPct = (totalOcupadas + totalLibres) > 0
    ? Math.round((totalOcupadas / (totalOcupadas + totalLibres)) * 100)
    : 0;

  // ---- Restricciones: últimas (7 días) y Top 4 por tipo ----
  const ultimasRestriccionesSemana: UltimaRestriccion[] =
    [...restricciones]
      .filter(r => withinLastDays(r?.fechaCreacion, 7))
      .sort((a, b) => safeTime(b?.fechaCreacion) - safeTime(a?.fechaCreacion))
      .slice(0, 5)
      .map(r => ({
        id: r?.id ?? Math.random().toString(36).slice(2, 10),
        tipo: r?.tipo,
        fecha: fmtDate(r?.fechaCreacion),
        descripcion: r?.descripcion,
      }));

  const byTipo = new Map<string, number>();
  for (const r of restricciones) {
    const tipo = String(r?.tipo ?? "Sin tipo").trim() || "Sin tipo";
    byTipo.set(tipo, (byTipo.get(tipo) ?? 0) + 1);
  }
  const restriccionesTopTipos: RestriccionTop[] =
    Array.from(byTipo.entries())
      .map(([tipo, cantidad]) => ({ tipo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 4);

  return {
    docentesTotal,
    asignaturasTotal,
    edificiosTotal,
    salasTotal,
    ocupacionGlobalPct,
    totalOcupadas,
    totalLibres,
    ocupacionPorEdificio,
    ultimasRestriccionesSemana,
    restriccionesTopTipos,
  };
}

const dashService = { computeDashboardStats };
export default dashService;
