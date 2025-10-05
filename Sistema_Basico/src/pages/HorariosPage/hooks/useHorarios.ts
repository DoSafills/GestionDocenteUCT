import { useState } from 'react';
import { HorarioService } from '../services/horarioService';
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
      const datos = await service.obtenerHorariosPorSeccion(seccionId);
      setHorarios(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  const obtenerHorarioPorClase = async (claseId: string) => {
    setCargando(true);
    setError(null);
    try {
      const horario = await service.obtenerHorarioPorClase(claseId);
      return horario;
    } catch (err) {
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
      const datos = await service.filtrarHorarios(filtros);
      setHorarios(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  const obtenerEstadisticas = async () => {
    try {
      return await service.obtenerEstadisticas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
  };

  return {
    horarios,
    cargando,
    error,
    obtenerHorariosPorSeccion,
    obtenerHorarioPorClase,
    filtrarHorarios,
    obtenerEstadisticas,
    setHorarios
  };
};