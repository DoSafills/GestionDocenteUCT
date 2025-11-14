import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus, Building } from "lucide-react";

import { useEdificios } from "./hooks/useEdificios";
import { useFiltrosEdificios } from "./hooks/useFiltrosEdificios";
import type { FormularioEdificio, FormularioSala } from "./hooks/useEdificios";

import { ModalEdificio } from "./components/ModalEdificio";
import { ModalSala } from "./components/ModalSala";
import { FiltrosEdificios } from "./components/FiltrosEdificios";
import { TarjetaEdificio } from "./components/TarjetaEdificio";

import type { EdificioDTO } from "@/domain/edificios/types";
import type { SalaDTO } from "@/domain/salas/types";

export function EdificiosPage() {
  // Hook de lógica de negocio
  const {
    campus,
    edificios,
    salas,
    loading,
    getCampusNombre,
    getSalasPorEdificio,
    crearEdificio,
    actualizarEdificio,
    eliminarEdificio,
    crearSala,
    actualizarSala,
    eliminarSala,
  } = useEdificios();

  // Hook de filtros
  const {
    busqueda,
    setBusqueda,
    filtroTipo,
    setFiltroTipo,
    edificioSeleccionado,
    setEdificioSeleccionado,
    edificiosFiltrados,
    getSalasFiltradas,
  } = useFiltrosEdificios({ edificios, salas, getCampusNombre });

  // Estados de modales
  const [modalEdificioAbierto, setModalEdificioAbierto] = useState(false);
  const [modalSalaAbierto, setModalSalaAbierto] = useState(false);

  // Estados de edición
  const [editandoEdificio, setEditandoEdificio] = useState<EdificioDTO | null>(null);
  const [editandoSala, setEditandoSala] = useState<{ edificioId: number | ""; sala: SalaDTO | null }>({
    edificioId: "",
    sala: null,
  });

  // Estados de formularios
  const [formularioEdificio, setFormularioEdificio] = useState<FormularioEdificio>({
    nombre: "",
    pisos: "",
    campus_id: "",
  });

  const [formularioSala, setFormularioSala] = useState<FormularioSala>({
    codigo: "",
    capacidad: "",
    tipo: "aula",
    equipamiento: "",
    disponible: true,
  });

  // ---------- Handlers de Edificio ----------
  const resetFormularioEdificio = () => {
    setFormularioEdificio({
      nombre: "",
      pisos: "",
      campus_id: campus.length ? campus[0].id : "",
    });
    setEditandoEdificio(null);
  };

  const abrirModalCrearEdificio = () => {
    resetFormularioEdificio();
    setModalEdificioAbierto(true);
  };

  const editarEdificioClick = (edificio: EdificioDTO) => {
    setFormularioEdificio({
      nombre: edificio.nombre,
      pisos: edificio.pisos != null ? String(edificio.pisos) : "",
      campus_id: edificio.campus_id,
    });
    setEditandoEdificio(edificio);
    setModalEdificioAbierto(true);
  };

  const handleSubmitEdificio = async () => {
    const exitoso = editandoEdificio
      ? await actualizarEdificio(editandoEdificio.id, formularioEdificio)
      : await crearEdificio(formularioEdificio);

    if (exitoso) {
      resetFormularioEdificio();
      setModalEdificioAbierto(false);
    }
  };

  // ---------- Handlers de Sala ----------
  const resetFormularioSala = () => {
    setFormularioSala({
      codigo: "",
      capacidad: "",
      tipo: "aula",
      equipamiento: "",
      disponible: true,
    });
    setEditandoSala({ edificioId: "", sala: null });
  };

  const agregarSala = (edificioId: number) => {
    resetFormularioSala();
    setEditandoSala({ edificioId, sala: null });
    setModalSalaAbierto(true);
  };

  const editarSalaClick = (edificioId: number, sala: SalaDTO) => {
    setFormularioSala({
      codigo: sala.codigo,
      capacidad: String(sala.capacidad),
      tipo: sala.tipo as any,
      equipamiento: sala.equipamiento ?? "",
      disponible: !!sala.disponible,
    });
    setEditandoSala({ edificioId, sala });
    setModalSalaAbierto(true);
  };

  const handleSubmitSala = async () => {
    if (!editandoSala.edificioId) return;

    const exitoso = editandoSala.sala
      ? await actualizarSala(editandoSala.sala.id, editandoSala.edificioId as number, formularioSala)
      : await crearSala(editandoSala.edificioId as number, formularioSala);

    if (exitoso) {
      resetFormularioSala();
      setModalSalaAbierto(false);
    }
  };

  // ---------- Renderizado ----------
  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Cargando edificios y salas…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">Gestión de Salas y Edificios</h2>
          <p className="text-muted-foreground">
            Administra la infraestructura y asignación de espacios físicos
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="default" onClick={abrirModalCrearEdificio}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Edificio
          </Button>
        </div>
      </div>

      {/* Modales */}
      <ModalEdificio
        abierto={modalEdificioAbierto}
        onCambiarEstado={setModalEdificioAbierto}
        formulario={formularioEdificio}
        onCambiarFormulario={setFormularioEdificio}
        campus={campus}
        esEdicion={!!editandoEdificio}
        onSubmit={handleSubmitEdificio}
      />

      <ModalSala
        abierto={modalSalaAbierto}
        onCambiarEstado={setModalSalaAbierto}
        formulario={formularioSala}
        onCambiarFormulario={setFormularioSala}
        edificios={edificios}
        edificioSeleccionado={editandoSala.edificioId}
        onCambiarEdificio={(id) => setEditandoSala(prev => ({ ...prev, edificioId: id }))}
        esEdicion={!!editandoSala.sala}
        onSubmit={handleSubmitSala}
      />

      {/* Filtros */}
      <FiltrosEdificios
        busqueda={busqueda}
        onCambioBusqueda={setBusqueda}
        edificioSeleccionado={edificioSeleccionado}
        onCambioEdificio={setEdificioSeleccionado}
        filtroTipo={filtroTipo}
        onCambioTipo={setFiltroTipo}
        edificios={edificios}
      />

      {/* Lista de edificios */}
      <div className="space-y-6">
        {edificiosFiltrados.map(edificio => {
          const salasEdificio = getSalasFiltradas(edificio.id, edificio);

          if (salasEdificio.length === 0 && busqueda && !edificio.nombre.toLowerCase().includes(busqueda.toLowerCase())) {
            return null;
          }

          return (
            <TarjetaEdificio
              key={edificio.id}
              edificio={edificio}
              campusNombre={getCampusNombre(edificio.campus_id)}
              salas={salasEdificio}
              onAgregarSala={() => agregarSala(edificio.id)}
              onEditarEdificio={() => editarEdificioClick(edificio)}
              onEliminarEdificio={() => eliminarEdificio(edificio.id)}
              onEditarSala={(sala) => editarSalaClick(edificio.id, sala)}
              onEliminarSala={(salaId) => eliminarSala(salaId)}
            />
          );
        })}
      </div>

      {/* Estado vacío */}
      {edificiosFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">No hay edificios registrados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza agregando tu primer edificio para gestionar las salas
            </p>
            <Button onClick={abrirModalCrearEdificio}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Edificio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}