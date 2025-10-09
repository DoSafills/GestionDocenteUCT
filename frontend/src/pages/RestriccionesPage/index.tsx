import { useState, useEffect, useMemo } from "react";
import { Filtros } from "./components/Filtros";
import { ResumenRestricciones } from "./components/resumenrestricciones";
import { FormularioRestriccion } from "./components/formulariorestricciones";
import { ListaRestricciones } from "./components/listarestricciones";
import { ConfirmacionDialog } from "./components/configuraciondialog";

import type { RestriccionAcademica } from "../../types";
import type { Formulario, TipoRestriccion } from "./components/formulariorestricciones";

import { db } from "../../data/restricciones";

// Formulario inicial
const FORMULARIO_INICIAL: Formulario = {
  tipo: "prerrequisito" as TipoRestriccion,
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
  },
};

// Validar que prioridad sea del tipo correcto
const validarPrioridad = (p: string): "alta" | "media" | "baja" => {
  if (p === "alta" || p === "media" || p === "baja") return p;
  return "media";
};

export function RestriccionesPage() {
  const [restricciones, setRestricciones] = useState<RestriccionAcademica[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>("todos");
  const [filtroActiva, setFiltroActiva] = useState<string>("todos");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_INICIAL);

  const [dialogConfirmacionAbierto, setDialogConfirmacionAbierto] = useState(false);
  const [accionAConfirmar, setAccionAConfirmar] = useState<"crear" | "editar" | "eliminar" | null>(null);
  const [restriccionObjetivo, setRestriccionObjetivo] = useState<RestriccionAcademica | null>(null);

  // Funciones mock
  const obtenerTodasMock = async () => await db.getAll();
  const crearRestriccionMock = async (r: RestriccionAcademica) => await db.create(r);
  const actualizarRestriccionMock = async (id: string, datos: Partial<RestriccionAcademica>) =>
    await db.update(id, datos);
  const eliminarRestriccionMock = async (id: string) => await db.delete(id);
  const toggleEstadoMock = async (id: string) => await db.toggleEstado(id);

  // Cargar restricciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTodasMock();
        setRestricciones(
          data.map(r => ({ ...r, prioridad: validarPrioridad(r.prioridad) }))
        );
      } catch (error) {
        console.error("Error cargando restricciones:", error);
      }
    };
    fetchData();
  }, []);

  // Abrir modal para CREAR
  const abrirModalParaCrear = () => {
    setFormulario(FORMULARIO_INICIAL);
    setEditando(false);
    setRestriccionObjetivo(null);
    setModalAbierto(true);
  };

  // Abrir modal para EDITAR
  const abrirModalParaEditar = (r: RestriccionAcademica) => {
    setFormulario({
      ...r,
      prioridad: validarPrioridad(r.prioridad),
      parametros: r.parametros || { ...FORMULARIO_INICIAL.parametros },
    });
    setEditando(true);
    setModalAbierto(true);
    setRestriccionObjetivo(r);
  };

  // Confirmar CREAR o EDITAR
  const handleConfirmarGuardado = () => {
    setAccionAConfirmar(editando ? "editar" : "crear");
    setDialogConfirmacionAbierto(true);
  };

  // Guardar restricción
  const handleSubmit = async () => {
    try {
      const prioridadValidada = validarPrioridad(formulario.prioridad);
      if (editando && restriccionObjetivo) {
        await actualizarRestriccionMock(restriccionObjetivo.id, formulario);
        setRestricciones(prev =>
          prev.map(r =>
            r.id === restriccionObjetivo.id
              ? { ...r, ...formulario, prioridad: prioridadValidada, parametros: formulario.parametros || {} }
              : r
          )
        );
      } else {
        const nuevaRestriccion: RestriccionAcademica = {
          ...formulario,
          prioridad: prioridadValidada,
          parametros: formulario.parametros || {},
          id: crypto.randomUUID(),
          fechaCreacion: new Date().toISOString(),
          creadoPor: "usuarioActual",
        };

        const creada = await crearRestriccionMock(nuevaRestriccion);
        setRestricciones(prev => [...prev, creada]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalAbierto(false);
      setEditando(false);
      setRestriccionObjetivo(null);
      setFormulario(FORMULARIO_INICIAL);
    }
  };

  // Eliminar
  const handleEliminar = async (r: RestriccionAcademica) => {
    setAccionAConfirmar("eliminar");
    setRestriccionObjetivo(r);
    setDialogConfirmacionAbierto(true);
  };


  // Acción final para ELIMINAR
  const ejecutarEliminar = async () => {
    if (!restriccionObjetivo?.id) return;
    try {
      await eliminarRestriccionMock(restriccionObjetivo.id);
      setRestricciones(prev => prev.filter(item => item.id !== restriccionObjetivo.id));
    } catch (error) {
      console.error(error);
    } finally {
      setRestriccionObjetivo(null);
    }
  };

  // Activar/desactivar
  const handleToggle = async (r: RestriccionAcademica) => {
    if (!r.id) return;
    const actualizado = await toggleEstadoMock(r.id);
    if (!actualizado) return;
    setRestricciones(prev =>
      prev.map(item => (item.id === r.id ? actualizado : item))
    );
  };

  // Filtrar
  const restriccionesFiltradas = useMemo(() => {
    return restricciones.filter(r => {
      const matchBusqueda = r.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = filtroTipo === "todos" || r.tipo === filtroTipo;
      const matchPrioridad = filtroPrioridad === "todos" || r.prioridad === filtroPrioridad;
      const matchActiva =
        filtroActiva === "todos" || (filtroActiva === "activa" ? r.activa : !r.activa);
      return matchBusqueda && matchTipo && matchPrioridad && matchActiva;
    });
  }, [restricciones, busqueda, filtroTipo, filtroPrioridad, filtroActiva]);

  return (
    <div className="space-y-6">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={abrirModalParaCrear}
      >
        Crear nueva restricción
      </button>

      {modalAbierto && (
        <FormularioRestriccion
          formulario={formulario}
          setFormulario={setFormulario}
          handleSubmit={handleConfirmarGuardado}  // ⚠️ ahora abre el diálogo
          modalCerrar={() => setModalAbierto(false)}
          editando={editando}
        />
      )}

      <Filtros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        filtroPrioridad={filtroPrioridad}
        setFiltroPrioridad={setFiltroPrioridad}
        filtroActiva={filtroActiva}
        setFiltroActiva={setFiltroActiva}
      />

      <ResumenRestricciones restricciones={restriccionesFiltradas} />

      <ListaRestricciones
        restricciones={restriccionesFiltradas}
        setRestricciones={setRestricciones}
        busqueda={busqueda}
        filtroTipo={filtroTipo}
        filtroPrioridad={filtroPrioridad}
        filtroActiva={filtroActiva}
        setModalAbierto={setModalAbierto}
        abrirModalParaEditar={abrirModalParaEditar}
        setDialogConfirmacionAbierto={setDialogConfirmacionAbierto}
        setAccionAConfirmar={setAccionAConfirmar}
        setRestriccionObjetivo={setRestriccionObjetivo}
        handleEliminar={handleEliminar} // ⚠️ ahora abre el diálogo
      />

      <ConfirmacionDialog
        dialogConfirmacionAbierto={dialogConfirmacionAbierto}
        setDialogConfirmacionAbierto={setDialogConfirmacionAbierto}
        accionAConfirmar={accionAConfirmar}
        restriccionObjetivo={restriccionObjetivo}
        ejecutarAccion={() => {
          if (accionAConfirmar === "crear" || accionAConfirmar === "editar") {
            handleSubmit();
          } else if (accionAConfirmar === "eliminar") {
            ejecutarEliminar();
          }
        }}
        setAccionAConfirmar={setAccionAConfirmar}
        setRestriccionObjetivo={setRestriccionObjetivo}
      />
    </div>
  );
}
