import { useState, useMemo } from "react";
import type { EdificioDTO } from "@/domain/edificios/types";
import type { SalaDTO } from "@/domain/salas/types";

interface UseFiltrosEdificiosProps {
  edificios: EdificioDTO[];
  salas: SalaDTO[];
  getCampusNombre: (campusId: number) => string;
}

export const useFiltrosEdificios = ({
  edificios,
  salas,
  getCampusNombre,
}: UseFiltrosEdificiosProps) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [edificioSeleccionado, setEdificioSeleccionado] = useState<string>("todos");

  const edificiosFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    return edificios.filter(edificio => {
      // Filtro por edificio específico
      if (edificioSeleccionado !== "todos" && String(edificio.id) !== edificioSeleccionado) {
        return false;
      }

      // Si no hay búsqueda, mostrar todos
      if (term === "") return true;

      // Búsqueda en datos del edificio
      const campusNombre = getCampusNombre(edificio.campus_id).toLowerCase();
      const pisosStr = edificio.pisos != null ? String(edificio.pisos) : "";
      const edificioCoincide =
        edificio.nombre.toLowerCase().includes(term) ||
        campusNombre.includes(term) ||
        pisosStr.includes(term);

      // Búsqueda en salas del edificio
      const salasCoinciden = salas.some(sala =>
        sala.edificio_id === edificio.id &&
        (
          sala.codigo.toLowerCase().includes(term) ||
          sala.tipo.toLowerCase().includes(term) ||
          (sala.equipamiento ?? "").toLowerCase().includes(term)
        )
      );

      return edificioCoincide || salasCoinciden;
    });
  }, [edificios, salas, edificioSeleccionado, busqueda, getCampusNombre]);

  const getSalasFiltradas = (edificioId: number, edificio: EdificioDTO) => {
    return salas.filter(sala => {
      if (sala.edificio_id !== edificioId) return false;

      const term = busqueda.trim().toLowerCase();
      const coincideBusqueda =
        term === "" ||
        sala.codigo.toLowerCase().includes(term) ||
        sala.tipo.toLowerCase().includes(term) ||
        (sala.equipamiento ?? "").toLowerCase().includes(term) ||
        edificio.nombre.toLowerCase().includes(term) ||
        getCampusNombre(edificio.campus_id).toLowerCase().includes(term);

      const coincideTipo = filtroTipo === "todos" || sala.tipo === filtroTipo;

      return coincideBusqueda && coincideTipo;
    });
  };

  const resetFiltros = () => {
    setBusqueda("");
    setFiltroTipo("todos");
    setEdificioSeleccionado("todos");
  };

  return {
    busqueda,
    setBusqueda,
    filtroTipo,
    setFiltroTipo,
    edificioSeleccionado,
    setEdificioSeleccionado,
    edificiosFiltrados,
    getSalasFiltradas,
    resetFiltros,
  };
};
