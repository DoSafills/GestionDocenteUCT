// src/pages/RestriccionesPage/RestriccionesPage.tsx
import { useState, useMemo } from "react";
import { Filtros } from "./components/Filtros";
import { ResumenRestricciones } from "./components/resumenrestricciones";
import { FormularioRestriccion } from "./components/formulariorestricciones";
import { ListaRestricciones } from "./components/listarestricciones";
import { ConfirmacionDialog } from "./components/configuraciondialog";

import type { TipoRestriccion, Formulario } from "./components/formulariorestricciones";
import type { RestriccionAcademica } from "../../types";

// Formulario inicial
const FORMULARIO_INICIAL: Formulario = {
  tipo: "prerrequisito" as TipoRestriccion,
  prioridad: "media",
  descripcion: "",
  mensaje: "",
  activa: true,
  parametros: {
    docente_rut: "",
    operador: "",
    valor: "",
    comentario: "",
    asignaturaOrigen: "",
    asignaturaDestino: "",
    salaProhibida: "",
    especialidadRequerida: "",
    diaRestriccion: "",
    horaInicioRestriccion: "",
    horaFinRestriccion: "",
  },
};

// Mock inicial
const RESTRICCIONES_MOCK: RestriccionAcademica[] = [
  {
    id: crypto.randomUUID(),
    descripcion: "Ejemplo de restricción académica",
    tipo: "prerrequisito",
    prioridad: "media",
    mensaje: "Mensaje inicial",
    activa: true,
    fechaCreacion: new Date().toISOString(),
    creadoPor: "Admin",
    parametros: {
      docente_rut: "12345678-9",
      operador: "=",
      valor: "Matemática I",
      comentario: "Ejemplo inicial",
    },
  },
];

export function RestriccionesPage() {
  const [restricciones, setRestricciones] = useState<RestriccionAcademica[]>(RESTRICCIONES_MOCK);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>("todos");
  const [filtroActiva, setFiltroActiva] = useState<string>("todos");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_INICIAL);

  const [dialogConfirmacionAbierto, setDialogConfirmacionAbierto] = useState(false);
  const [accionAConfirmar, setAccionAConfirmar] = useState<"crear" | "eliminar" | null>(null);
  const [restriccionObjetivo, setRestriccionObjetivo] = useState<RestriccionAcademica | null>(null);

  const abrirModalParaCrear = () => {
    setFormulario(FORMULARIO_INICIAL);
    setEditando(false);
    setRestriccionObjetivo(null);
    setModalAbierto(true);
  };

  const abrirModalParaEditar = (r: RestriccionAcademica) => {
    setFormulario({
      tipo: r.tipo as TipoRestriccion,
      descripcion: r.descripcion,
      mensaje: r.mensaje || "",
      prioridad: r.prioridad,
      activa: r.activa,
      parametros: { ...r.parametros },
    });
    setEditando(true);
    setModalAbierto(true);
    setRestriccionObjetivo(r);
  };

  const handleSubmit = () => {
    if (editando && restriccionObjetivo) {
      setRestricciones(prev =>
        prev.map(r =>
          r.id === restriccionObjetivo.id
            ? {
                ...r,
                tipo: formulario.tipo,
                descripcion: formulario.descripcion,
                mensaje: formulario.mensaje,
                prioridad: formulario.prioridad,
                activa: formulario.activa,
                parametros: { ...formulario.parametros },
              }
            : r
        )
      );
    } else {
      const nueva: RestriccionAcademica = {
        id: crypto.randomUUID(),
        fechaCreacion: new Date().toISOString(),
        creadoPor: "Admin",
        tipo: formulario.tipo,
        descripcion: formulario.descripcion,
        mensaje: formulario.mensaje,
        prioridad: formulario.prioridad,
        activa: formulario.activa,
        parametros: { ...formulario.parametros },
      };
      setRestricciones(prev => [...prev, nueva]);
    }

    setModalAbierto(false);
    setEditando(false);
    setRestriccionObjetivo(null);
    setFormulario(FORMULARIO_INICIAL);
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
        abrirModalParaEditar={abrirModalParaEditar}
        setDialogConfirmacionAbierto={setDialogConfirmacionAbierto}
        setAccionAConfirmar={setAccionAConfirmar}
        setRestriccionObjetivo={setRestriccionObjetivo}
        filtroActiva={filtroActiva}
        setModalAbierto={setModalAbierto}
        busqueda={busqueda}
        filtroTipo={filtroTipo}
        filtroPrioridad={filtroPrioridad}
      />

      <ConfirmacionDialog
        dialogConfirmacionAbierto={dialogConfirmacionAbierto}
        setDialogConfirmacionAbierto={setDialogConfirmacionAbierto}
        accionAConfirmar={accionAConfirmar}
        restriccionObjetivo={restriccionObjetivo}
        setRestricciones={setRestricciones}
        setAccionAConfirmar={setAccionAConfirmar}
        setRestriccionObjetivo={setRestriccionObjetivo}
      />
    </div>
  );
}
