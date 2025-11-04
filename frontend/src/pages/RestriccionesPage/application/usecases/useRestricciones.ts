import { useState, useEffect, useMemo } from "react";
import type { Formulario } from "../usecases/FormularioRestriccionService";
import { db } from "@infraestructure/repositories/RestriccionesMockRepository";
import type { RestriccionAcademica as DomainRestriccion } from "@domain/entities/restriccionespage/RestriccionAcademica";
import type { RestriccionAcademica } from "@/types/index"; // <- tipo esperado por db y hook

// 🔹 Validación de prioridad
const validarPrioridad = (p: string): "alta" | "media" | "baja" => {
  if (p === "alta" || p === "media" || p === "baja") return p;
  return "media";
};

// 🔹 Estado inicial del formulario
export const FORMULARIO_INICIAL: Formulario = {
  tipo: "prerrequisito",
  prioridad: "media",
  descripcion: "",
  mensaje: "",
  activa: true,
  parametros: {
    asignaturaOrigen: "",
    asignaturaDestino: "",
    salaProhibida: "",
    especialidadRequerida: "",
    diaRestriccion: "",
    horaInicioRestriccion: "",
    horaFinRestriccion: "",
    fechaCreacion: "",
    creadoPor: "",
  },
};

// 🔹 Contador de IDs numérico
let contadorId = Date.now();

// 🔹 Función helper: convierte Domain → Tipo esperado
const normalizarRestriccion = (r: DomainRestriccion): RestriccionAcademica => ({
  id: r.id ?? ++contadorId,
  tipo: r.tipo,
  descripcion: r.descripcion,
  mensaje: r.mensaje,
  prioridad: validarPrioridad(r.prioridad ?? "media"),
  activa: r.activa,
  fechaCreacion: r.parametros.fechaCreacion ?? "",
  creadoPor: r.parametros.creadoPor ?? "",
  parametros: {
    ...r.parametros,
    fechaCreacion: undefined, // removemos duplicado
    creadoPor: undefined,     // removemos duplicado
  },
});

export function useRestriccionesPage() {
  const [restricciones, setRestricciones] = useState<RestriccionAcademica[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>("todos");
  const [filtroActiva, setFiltroActiva] = useState<string>("todos");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_INICIAL);
  const [restriccionParaEditar, setRestriccionParaEditar] = useState<RestriccionAcademica | null>(null);

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [restriccionParaEliminar, setRestriccionParaEliminar] = useState<RestriccionAcademica | null>(null);

  // 🔹 Cargar restricciones iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: DomainRestriccion[] = await db.getAll();
        setRestricciones(data.map(normalizarRestriccion));
      } catch (error) {
        console.error("Error cargando restricciones:", error);
      }
    };
    fetchData();
  }, []);

  // 🔹 Crear o editar
  const guardarRestriccion = async (
    formData: Formulario,
    editando: boolean,
    restriccionParaEditar: RestriccionAcademica | null
  ) => {
    const prioridadValidada = validarPrioridad(formData.prioridad);

    if (editando && restriccionParaEditar?.id) {
      await db.update(restriccionParaEditar.id, { ...formData, prioridad: prioridadValidada });
      setRestricciones((prev) =>
        prev.map((r) =>
          r.id === restriccionParaEditar.id
            ? normalizarRestriccion({
                ...formData,
                id: r.id,
                parametros: {
                  ...formData.parametros,
                  fechaCreacion: r.fechaCreacion,
                  creadoPor: r.creadoPor,
                },
              })
            : r
        )
      );
    } else {
      const nuevaRestriccion: RestriccionAcademica = normalizarRestriccion({
        id: ++contadorId,
        ...formData,
        parametros: {
          ...formData.parametros,
          fechaCreacion: formData.parametros.fechaCreacion ?? "",
          creadoPor: formData.parametros.creadoPor ?? "",
        },
      });
      const creada = await db.create(nuevaRestriccion);
      setRestricciones((prev) => [...prev, creada]);
    }
  };

  // 🔹 Activar/desactivar
  const toggleRestriccion = async (r: RestriccionAcademica) => {
    if (!r.id) return;
    const actualizado = await db.toggleEstado(r.id);
    if (!actualizado) return;
    setRestricciones((prev) =>
      prev.map((item) => (item.id === r.id ? normalizarRestriccion(actualizado) : item))
    );
  };

  // 🔹 Modal creación/edición
  const abrirModalParaCrear = () => {
    setFormulario(FORMULARIO_INICIAL);
    setEditando(false);
    setRestriccionParaEditar(null);
    setModalAbierto(true);
  };

  const abrirModalParaEditar = (r: RestriccionAcademica) => {
    setFormulario({
      tipo: r.tipo,
      prioridad: r.prioridad,
      descripcion: r.descripcion,
      mensaje: r.mensaje,
      activa: r.activa,
      parametros: r.parametros,
    });
    setEditando(true);
    setRestriccionParaEditar(r);
    setModalAbierto(true);
  };

  // 🔹 Modal eliminación
  const abrirConfirmacionEliminar = (r: RestriccionAcademica) => {
    setRestriccionParaEliminar(r);
    setModalEliminarAbierto(true);
  };
  const cancelarEliminar = () => {
    setRestriccionParaEliminar(null);
    setModalEliminarAbierto(false);
  };
  const confirmarEliminar = async () => {
    if (!restriccionParaEliminar?.id) return;
    await db.delete(restriccionParaEliminar.id);
    setRestricciones((prev) => prev.filter((r) => r.id !== restriccionParaEliminar.id));
    cancelarEliminar();
  };

  // 🔹 Filtros
  const restriccionesFiltradas = useMemo(() => {
    return restricciones.filter((r) => {
      const matchBusqueda = r.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = filtroTipo === "todos" || r.tipo === filtroTipo;
      const matchPrioridad = filtroPrioridad === "todos" || r.prioridad === filtroPrioridad;
      const matchActiva =
        filtroActiva === "todos" || (filtroActiva === "activa" ? r.activa : !r.activa);
      return matchBusqueda && matchTipo && matchPrioridad && matchActiva;
    });
  }, [restricciones, busqueda, filtroTipo, filtroPrioridad, filtroActiva]);

  return {
    restriccionesFiltradas,
    restricciones,
    setRestricciones,
    busqueda,
    setBusqueda,
    filtroTipo,
    setFiltroTipo,
    filtroPrioridad,
    setFiltroPrioridad,
    filtroActiva,
    setFiltroActiva,
    modalAbierto,
    setModalAbierto,
    editando,
    formulario,
    restriccionParaEditar,
    abrirModalParaCrear,
    abrirModalParaEditar,
    guardarRestriccion,
    toggleRestriccion,
    modalEliminarAbierto,
    restriccionParaEliminar,
    abrirConfirmacionEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
