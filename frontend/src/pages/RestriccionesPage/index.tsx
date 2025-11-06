import React, { useState } from "react";
import { Filtros } from "./ui/componentes/Filtros";
import { ResumenRestricciones } from "./ui/componentes/resumenrestricciones";
import { ListaRestricciones } from "./ui/componentes/listarestricciones";
import { FormularioRestriccion } from "./ui/componentes/formulariorestricciones";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useRestriccionesPage } from "./application/usecases/useRestricciones";
import type { RestriccionAcademica, TipoRestriccion } from "@domain/entities/restriccionespage/RestriccionAcademica";
import { Table as TableIcon, XCircle, CheckCircle, AlertTriangle, Plus } from "lucide-react";

export function RestriccionesPage() {
  const {
    restriccionesFiltradas,
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
    setRestricciones,
  } = useRestriccionesPage();

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [restriccionParaEliminar, setRestriccionParaEliminar] = useState<RestriccionAcademica | null>(null);

  const cancelarEliminar = (): void => {
    setModalEliminarAbierto(false);
    setRestriccionParaEliminar(null);
  };

  const confirmarEliminar = (): void => {
    if (restriccionParaEliminar) {
      setRestricciones(prev =>
        prev.filter(r => r.id !== restriccionParaEliminar.id)
      );
      setModalEliminarAbierto(false);
      setRestriccionParaEliminar(null);
    }
  };

  // 🔹 Iconos por tipo, capacidad incluye prerrequisito/secuencia temporal
  const iconosPorTipo: Record<TipoRestriccion, React.ReactNode> = {
    sala_prohibida: <AlertTriangle />,
    horario_conflicto: <XCircle />,
    capacidad: <TableIcon />,
    profesor_especialidad: <CheckCircle />,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header con título y botón de crear */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restricciones Académicas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las reglas y limitaciones del sistema de horarios
          </p>
        </div>
        <Button onClick={abrirModalParaCrear} size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Nueva Restricción
        </Button>
      </div>

      {/* 🔹 Modal de creación / edición */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editando ? "Editar Restricción" : "Crear Nueva Restricción"}
            </DialogTitle>
          </DialogHeader>

          <FormularioRestriccion
            inicial={formulario}
            onSubmit={async (f) => {
              await guardarRestriccion(f, editando, restriccionParaEditar);
              setModalAbierto(false);
            }}
            editando={editando}
            modalCerrar={() => setModalAbierto(false)}
          />

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔹 Modal de confirmación de eliminación */}
      <Dialog open={modalEliminarAbierto} onOpenChange={setModalEliminarAbierto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar la restricción{" "}
              <strong className="text-gray-900">{restriccionParaEliminar?.descripcion}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={cancelarEliminar}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarEliminar}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔹 Filtros */}
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

      {/* 🔹 Resumen */}
      <ResumenRestricciones restricciones={restriccionesFiltradas} />

      {/* 🔹 Lista de restricciones */}
      <ListaRestricciones
        restricciones={restriccionesFiltradas}
        setRestricciones={setRestricciones}
        abrirModalParaEditar={abrirModalParaEditar}
        handleToggle={toggleRestriccion}
        iconosPorTipo={iconosPorTipo} // pasamos iconos actualizados
        solicitarEliminar={(r: RestriccionAcademica) => {
          setRestriccionParaEliminar(r);
          setModalEliminarAbierto(true);
        }}
        busqueda={busqueda}
        filtroTipo={filtroTipo}
        filtroPrioridad={filtroPrioridad}
        filtroActiva={filtroActiva}
        setModalAbierto={setModalAbierto}
      />
    </div>
  );
}
