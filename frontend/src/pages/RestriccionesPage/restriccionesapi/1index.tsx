import { useState, useEffect, useMemo } from "react";
import { Filtros } from "./components/Filtros";
import { ResumenRestricciones } from "./components/resumenrestricciones";
import { FormularioRestriccion } from "./components/formulariorestricciones";
import { ListaRestricciones } from "./components/listarestricciones";
import { ConfirmacionDialog } from "./components/configuraciondialog";

import type { RestriccionAcademica } from "../../types";
import type { RestriccionDTO } from "./services/api";
import type { Formulario, TipoRestriccion } from "./components/formulariorestricciones";

import {
  obtenerTodas,
  crearRestriccion,
  actualizarRestriccion,
  eliminarRestriccion,
} from "./services/api";

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

  // Cargar restricciones desde la API
  useEffect(() => {
    obtenerTodas()
      .then((data: RestriccionDTO[]) => {
        const mapped: RestriccionAcademica[] = data.map(r => ({
          id: r.id?.toString() ?? crypto.randomUUID(),
          descripcion: r.valor ?? "",
          tipo: r.tipo as TipoRestriccion,
          mensaje: r.valor ?? "",
          prioridad: r.prioridad === 1 ? "alta" : r.prioridad === 2 ? "media" : "baja",
          activa: r.restriccion_dura ?? true,
          fechaCreacion: new Date().toISOString(),
          creadoPor: "API",
          parametros: {
            docente_rut: "",
            operador: "",
            valor: r.valor ?? "",
            comentario: "",
            asignaturaOrigen: "",
            asignaturaDestino: "",
            salaProhibida: "",
            especialidadRequerida: "",
            diaRestriccion: "",
            horaInicioRestriccion: "",
            horaFinRestriccion: "",
          },
        }));
        setRestricciones(mapped);
      })
      .catch(console.error);
  }, []);

  const abrirModalParaCrear = () => {
    setFormulario(FORMULARIO_INICIAL);
    setEditando(false);
    setRestriccionObjetivo(null);
    setModalAbierto(true);
    setAccionAConfirmar("crear");
  };

  const abrirModalParaEditar = (r: RestriccionAcademica) => {
    setFormulario({
      tipo: r.tipo,
      prioridad: r.prioridad,
      descripcion: r.descripcion,
      mensaje: r.mensaje,
      activa: r.activa,
      parametros: { ...r.parametros } as Formulario["parametros"],
    });
    setEditando(true);
    setModalAbierto(true);
    setRestriccionObjetivo(r);
    setAccionAConfirmar("editar");
  };

  const handleSubmit = async () => {
    try {
      const dto: RestriccionDTO = {
        tipo: formulario.tipo,
        valor: formulario.mensaje,
        prioridad: formulario.prioridad === "alta" ? 1 : formulario.prioridad === "media" ? 2 : 3,
        restriccion_dura: formulario.activa,
        restriccion_blanda: !formulario.activa,
      };

      if (editando && restriccionObjetivo) {
        await actualizarRestriccion(Number(restriccionObjetivo.id), dto);
        const actualizado: RestriccionAcademica = {
          ...restriccionObjetivo,
          descripcion: formulario.descripcion,
          mensaje: formulario.mensaje,
          tipo: formulario.tipo,
          prioridad: formulario.prioridad,
          activa: formulario.activa,
          parametros: { ...formulario.parametros },
        };
        setRestricciones(prev =>
          prev.map(r => (r.id === restriccionObjetivo.id ? actualizado : r))
        );
      } else {
        const nuevaDTO = await crearRestriccion(dto);
        const nueva: RestriccionAcademica = {
          id: nuevaDTO.id?.toString() ?? crypto.randomUUID(),
          tipo: formulario.tipo,
          descripcion: formulario.descripcion,
          mensaje: formulario.mensaje,
          prioridad: formulario.prioridad,
          activa: formulario.activa,
          fechaCreacion: new Date().toISOString(),
          creadoPor: "API",
          parametros: { ...formulario.parametros },
        };
        setRestricciones(prev => [...prev, nueva]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalAbierto(false);
      setEditando(false);
      setRestriccionObjetivo(null);
      setFormulario(FORMULARIO_INICIAL);
      setAccionAConfirmar(null);
    }
  };

  const handleEliminar = async () => {
    if (!restriccionObjetivo || !restriccionObjetivo.id) return;
    try {
      await eliminarRestriccion(Number(restriccionObjetivo.id));
      setRestricciones(prev => prev.filter(r => r.id !== restriccionObjetivo.id));
    } catch (error) {
      console.error(error);
    } finally {
      setDialogConfirmacionAbierto(false);
      setAccionAConfirmar(null);
      setRestriccionObjetivo(null);
    }
  };

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
          handleSubmit={handleSubmit}
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
        handleEliminar={handleEliminar}
      />

      <ConfirmacionDialog
        dialogConfirmacionAbierto={dialogConfirmacionAbierto}
        setDialogConfirmacionAbierto={setDialogConfirmacionAbierto}
        accionAConfirmar={accionAConfirmar}
        restriccionObjetivo={restriccionObjetivo}
        setAccionAConfirmar={setAccionAConfirmar}
        setRestriccionObjetivo={setRestriccionObjetivo}
        ejecutarAccion={
          accionAConfirmar === "eliminar"
            ? handleEliminar
            : handleSubmit
        }
      />
    </div>
  );
}
