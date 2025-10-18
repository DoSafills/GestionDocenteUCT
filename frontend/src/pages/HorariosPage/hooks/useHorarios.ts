import { useState } from 'react';
import { HorarioService } from '../../../application/services/horarioService';
import type { HorarioDetalle, FiltrosHorario } from '../types/horario';

export const useHorarios = () => {
  const [horarios, setHorarios] = useState<HorarioDetalle[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const service = new HorarioService();

  const obtenerHorariosPorSeccion = async (seccionId: string) => {
    setCargando(true);
    setError(null);
    try {
      console.log("[useHorarios] obtenerHorariosPorSeccion", seccionId);
      const datos = await service.obtenerHorariosPorSeccion(seccionId);
      console.log("[useHorarios] recibidos", datos.length);
      setHorarios(datos);
    } catch (err) {
      console.error("[useHorarios] error obtenerHorariosPorSeccion", err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  const obtenerHorarioPorClase = async (claseId: string) => {
    setCargando(true);
    setError(null);
    try {
      console.log("[useHorarios] obtenerHorarioPorClase", claseId);
      const horario = await service.obtenerHorarioPorClase(claseId);
      return horario;
    } catch (err) {
      console.error("[useHorarios] error obtenerHorarioPorClase", err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setCargando(false);
    }
  };

  const filtrarHorarios = async (filtros: FiltrosHorario) => {
    setCargando(true);
    setError(null);
    try {
      console.log("[useHorarios] filtrarHorarios", filtros);
      const datos = await service.filtrarHorarios(filtros);
      console.log("[useHorarios] recibidos", datos.length);
      setHorarios(datos);
    } catch (err) {
      console.error("[useHorarios] error filtrarHorarios", err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  return {
    horarios,
    cargando,
    error,
    obtenerHorariosPorSeccion,
    obtenerHorarioPorClase,
    filtrarHorarios, 
    setHorarios
  };
}
