// src/pages/RestriccionesPage/ui/pages/index.tsx
import React, { useState } from "react";
import { Filtros } from "../componentes/Filtros";
import { ResumenRestricciones } from "../componentes/resumenrestricciones";
import { ListaRestricciones } from "../componentes/listarestricciones";
import { FormularioRestriccion } from "../componentes/formulariorestricciones";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { useRestriccionesPage } from "../../application/usecases/useRestricciones";
import type { RestriccionAcademica } from "../../Domain/entities/restriccionespage/RestriccionAcademica";

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

  // 🔹 Estado para modal de eliminación
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [restriccionParaEliminar, setRestriccionParaEliminar] = useState<RestriccionAcademica | null>(null);

  // Cancelar eliminación
  const cancelarEliminar = () => {
    setModalEliminarAbierto(false);
    setRestriccionParaEliminar(null);
  };

  // Confirmar eliminación
  const confirmarEliminar = () => {
    if (restriccionParaEliminar) {
      setRestricciones(prev =>
        prev.filter(r => r.id !== restriccionParaEliminar.id)
      );
      setModalEliminarAbierto(false);
      setRestriccionParaEliminar(null);
    }
  };

  return (
    <div className="space-y-6">
      <Button onClick={abrirModalParaCrear}>Crear nueva restricción</Button>

      {/* 🔹 Modal de creación / edición */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editando ? "Editar Restricción" : "Crear Restricción"}
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
      <Dialog open={modalEliminarAbierto} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            ¿Seguro que deseas eliminar la restricción{" "}
            <strong>{restriccionParaEliminar?.descripcion}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={cancelarEliminar}>
              Cancelar
            </Button>
            <Button variant="default" onClick={confirmarEliminar}>
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
        // 🔹 Aquí pasamos la restricción directamente al modal
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
