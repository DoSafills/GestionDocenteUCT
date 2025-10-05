import { useState } from 'react';
import type { FormularioHorario } from '../types';
import { FORMULARIO_INICIAL } from '../types';

export const useFormularioHorario = () => {
  const [formulario, setFormulario] = useState<FormularioHorario>(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const actualizarCampo = (campo: keyof FormularioHorario, valor: any) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo cuando se actualiza
    if (errores[campo]) {
      setErrores(prev => {
        const nuevos = { ...prev };
        delete nuevos[campo];
        return nuevos;
      });
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formulario.titulo) {
      nuevosErrores.titulo = 'El título es obligatorio';
    }
    if (!formulario.salaId) {
      nuevosErrores.salaId = 'Debe seleccionar una sala';
    }
    if (!formulario.dia) {
      nuevosErrores.dia = 'Debe seleccionar un día';
    }
    if (!formulario.horaInicio) {
      nuevosErrores.horaInicio = 'La hora de inicio es obligatoria';
    }
    if (!formulario.horaFin) {
      nuevosErrores.horaFin = 'La hora de fin es obligatoria';
    }
    if (formulario.horaInicio && formulario.horaFin && formulario.horaInicio >= formulario.horaFin) {
      nuevosErrores.horaFin = 'La hora de fin debe ser posterior a la de inicio';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const resetearFormulario = () => {
    setFormulario(FORMULARIO_INICIAL);
    setErrores({});
  };

  const cargarDatos = (datos: Partial<FormularioHorario>) => {
    setFormulario(prev => ({ ...prev, ...datos }));
    setErrores({});
  };

  return {
    formulario,
    errores,
    actualizarCampo,
    validarFormulario,
    resetearFormulario,
    cargarDatos,
    setFormulario
  };
};