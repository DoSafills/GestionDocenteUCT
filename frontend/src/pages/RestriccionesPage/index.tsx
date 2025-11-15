import React, { useState, useEffect } from "react";
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
import type {
  RestriccionAcademica,
  TipoRestriccion,
} from "@domain/entities/restriccionespage/RestriccionAcademica";
import {
  Table as TableIcon,
  XCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import { DashboardPage } from "@pages/DashboardPage";

import {
  authService,
  type UsuarioActual,
} from "@/application/services/AuthService";

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

  const [modalEliminarAbierto, setModalEliminarAbierto] =
    useState(false);
  const [restriccionParaEliminar, setRestriccionParaEliminar] =
    useState<RestriccionAcademica | null>(null);

  const [usuario, setUsuario] = useState<UsuarioActual | null>(() =>
    authService.getUsuarioActual()
  );
  const [cargandoPermisos, setCargandoPermisos] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!usuario) {
      setCargandoPermisos(true);
      authService.cargarUsuarioDesdeApi().then((u) => {
        if (mounted) {
          setUsuario(u);
          setCargandoPermisos(false);
        }
      });
    }

    const unsub = authService.onChange((u) => {
      if (mounted) setUsuario(u);
    });

    return () => {
      mounted = false;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelarEliminar = (): void => {
    setModalEliminarAbierto(false);
    setRestriccionParaEliminar(null);
  };

  const confirmarEliminar = (): void => {
    if (restriccionParaEliminar) {
      setRestricciones((prev) =>
        prev.filter((r) => r.id !== restriccionParaEliminar.id)
      );
      setModalEliminarAbierto(false);
      setRestriccionParaEliminar(null);
    }
  };

  const iconosPorTipo: Record<TipoRestriccion, React.ReactNode> = {
    sala_prohibida: <AlertTriangle />,
    horario_conflicto: <XCircle />,
    capacidad: <TableIcon />,
    profesor_especialidad: <CheckCircle />,
  };

  // 🔹 Guard de acceso
  if (cargandoPermisos) {
    return <div>Verificando permisos…</div>;
  }

  // si no hay usuario o no es ADMIN → mostramos el Dashboard
  if (!usuario || !authService.hasRol("ADMINISTRADOR")) {
    return <DashboardPage />;
  }

  // 🔹 Si llegó hasta aquí, es ADMIN → render normal
  return (
    <div className="space-y-6">
      <Button onClick={abrirModalParaCrear}>Crear nueva restricción</Button>

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

      <Dialog
        open={modalEliminarAbierto}
        onOpenChange={setModalEliminarAbierto}
      >
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
            <Button variant="destructive" onClick={confirmarEliminar}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
        handleToggle={toggleRestriccion}
        iconosPorTipo={iconosPorTipo}
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
