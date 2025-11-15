import { useState, useEffect } from "react";
import { toast } from "sonner";

import { campusService } from "@/application/services/CampusService";
import { edificioService } from "@/application/services/EdificioService";
import { salaService } from "@/application/services/SalaService";

import type { CampusDTO } from "@/domain/campus/types";
import type { EdificioDTO, EdificioCreateDTO } from "@/domain/edificios/types";
import type { SalaDTO, SalaCreateDTO } from "@/domain/salas/types";

export type SalaTipo = "aula" | "laboratorio" | "auditorio" | "taller" | "sala_conferencias";

export interface FormularioEdificio {
  nombre: string;
  pisos: string;
  campus_id: number | "";
}

export interface FormularioSala {
  codigo: string;
  capacidad: string;
  tipo: SalaTipo;
  equipamiento: string;
  disponible: boolean;
}

export const useEdificios = () => {
  const [campus, setCampus] = useState<CampusDTO[]>([]);
  const [edificios, setEdificios] = useState<EdificioDTO[]>([]);
  const [salas, setSalas] = useState<SalaDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial
  useEffect(() => {
    (async () => {
      try {
        const [campusList, edificiosList, salasList] = await Promise.all([
          campusService.obtenerTodas(),
          edificioService.obtenerTodas(),
          salaService.buscar(0, 1000),
        ]);
        setCampus(campusList.map(c => c.toDTO()));
        setEdificios(edificiosList.map(e => e.toDTO()));
        setSalas(salasList.map(s => s.toDTO()));
      } catch (e: any) {
        toast.error(e?.message ?? "No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Helpers
  const getCampusNombre = (campus_id: number) => {
    const c = campus.find(x => x.id === campus_id);
    return c ? c.nombre : "";
  };

  const getSalasPorEdificio = (edificioId: number) => 
    salas.filter(s => s.edificio_id === edificioId);

  // Operaciones de Edificio
  const crearEdificio = async (formulario: FormularioEdificio) => {
    if (!formulario.nombre || !formulario.campus_id) {
      toast.error("Por favor completa los campos obligatorios (nombre y campus).");
      return false;
    }

    const payload: EdificioCreateDTO = {
      nombre: formulario.nombre.trim(),
      campus_id: Number(formulario.campus_id),
      pisos: formulario.pisos ? Number(formulario.pisos) : undefined,
    };

    try {
      const created = await edificioService.crearNueva(payload);
      const dto = created.toDTO();
      setEdificios(prev => [...prev, dto]);
      toast.success("Edificio agregado exitosamente");
      return true;
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo guardar el edificio.");
      return false;
    }
  };

  const actualizarEdificio = async (id: number, formulario: FormularioEdificio) => {
    if (!formulario.nombre || !formulario.campus_id) {
      toast.error("Por favor completa los campos obligatorios (nombre y campus).");
      return false;
    }

    const payload: EdificioCreateDTO = {
      nombre: formulario.nombre.trim(),
      campus_id: Number(formulario.campus_id),
      pisos: formulario.pisos ? Number(formulario.pisos) : undefined,
    };

    try {
      const updated = await edificioService.actualizar(id, payload);
      const dto = updated.toDTO();
      setEdificios(prev => prev.map(e => (e.id === dto.id ? dto : e)));
      toast.success("Edificio actualizado exitosamente");
      return true;
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo guardar el edificio.");
      return false;
    }
  };

  const eliminarEdificio = async (id: number) => {
    try {
      await edificioService.eliminar(id);
      setEdificios(prev => prev.filter(e => e.id !== id));
      setSalas(prev => prev.filter(s => s.edificio_id !== id));
      toast.success("Edificio eliminado exitosamente");
      return true;
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo eliminar el edificio.");
      return false;
    }
  };

  // Operaciones de Sala
  const crearSala = async (edificioId: number, formulario: FormularioSala) => {
    if (!formulario.codigo || !formulario.capacidad || !edificioId) {
      toast.error("Por favor completa código, capacidad y edificio.");
      return false;
    }

    const payload: SalaCreateDTO = {
      codigo: formulario.codigo.trim().toUpperCase(),
      capacidad: Number(formulario.capacidad),
      tipo: formulario.tipo,
      disponible: formulario.disponible,
      equipamiento: formulario.equipamiento?.trim() || undefined,
      edificio_id: Number(edificioId),
    };

    try {
      const created = await salaService.crearNueva(payload);
      const dto = created.toDTO();
      setSalas(prev => [...prev, dto]);
      toast.success("Sala agregada exitosamente");
      return true;
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo guardar la sala.");
      return false;
    }
  };

  const actualizarSala = async (id: number, edificioId: number, formulario: FormularioSala) => {
    if (!formulario.codigo || !formulario.capacidad || !edificioId) {
      toast.error("Por favor completa código, capacidad y edificio.");
      return false;
    }

    const payload: SalaCreateDTO = {
      codigo: formulario.codigo.trim().toUpperCase(),
      capacidad: Number(formulario.capacidad),
      tipo: formulario.tipo,
      disponible: formulario.disponible,
      equipamiento: formulario.equipamiento?.trim() || undefined,
      edificio_id: Number(edificioId),
    };

    try {
      const updated = await salaService.actualizar(id, payload);
      const dto = updated.toDTO();
      setSalas(prev => prev.map(s => (s.id === dto.id ? dto : s)));
      toast.success("Sala actualizada exitosamente");
      return true;
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo guardar la sala.");
      return false;
    }
  };

  const eliminarSala = async (salaId: number) => {
    try {
      await salaService.eliminar(salaId);
      setSalas(prev => prev.filter(s => s.id !== salaId));
      toast.success("Sala eliminada exitosamente");
      return true;
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo eliminar la sala.");
      return false;
    }
  };

  return {
    // Estado
    campus,
    edificios,
    salas,
    loading,
    // Helpers
    getCampusNombre,
    getSalasPorEdificio,
    // Operaciones Edificio
    crearEdificio,
    actualizarEdificio,
    eliminarEdificio,
    // Operaciones Sala
    crearSala,
    actualizarSala,
    eliminarSala,
  };
};
