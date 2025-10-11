import React from "react";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { asignaturasMock } from "../../../data/asignaturas";
import { diasSemana } from "../services/utils";

export type TipoRestriccion =
  | "prerrequisito"
  | "sala_prohibida"
  | "horario_conflicto"
  | "capacidad"
  | "profesor_especialidad"
  | "secuencia_temporal";

export interface Formulario {
  tipo: TipoRestriccion;
  descripcion: string;
  mensaje: string;
  prioridad: "alta" | "media" | "baja";
  activa: boolean;
  parametros: {
    docente_rut?: string;
    operador?: string;
    valor?: string;
    comentario?: string;
    asignaturaOrigen?: string;
    asignaturaDestino?: string;
    salaProhibida?: string;
    especialidadRequerida?: string;
    diaRestriccion?: string;
    horaInicioRestriccion?: string;
    horaFinRestriccion?: string;
  };
}

interface FormularioProps {
  formulario: Formulario;
  setFormulario: React.Dispatch<React.SetStateAction<Formulario>>;
  handleSubmit: () => void;
  modalCerrar: () => void;
  editando: boolean;
}

export function FormularioRestriccion({
  formulario,
  setFormulario,
  handleSubmit,
  modalCerrar,
  editando,
}: FormularioProps) {
  const renderParametrosEspecificos = () => {
    switch (formulario.tipo) {
      case "prerrequisito":
      case "secuencia_temporal":
        return (
          <div className="grid grid-cols-2 gap-4">
            {["origen", "destino"].map((t) => (
              <div key={t} className="space-y-2">
                <Label>Asignatura {t === "origen" ? "Origen" : "Destino"}</Label>
                <Select
                  value={
                    t === "origen"
                      ? formulario.parametros.asignaturaOrigen
                      : formulario.parametros.asignaturaDestino
                  }
                  onValueChange={(value) =>
                    setFormulario((prev) => ({
                      ...prev,
                      parametros: {
                        ...prev.parametros,
                        [t === "origen"
                          ? "asignaturaOrigen"
                          : "asignaturaDestino"]: value,
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar asignatura" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto bg-white text-black">
                    {asignaturasMock.map((asig) => (
                      <SelectItem key={asig.id} value={asig.codigo}>
                        {asig.codigo} - {asig.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );

      case "sala_prohibida":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asignatura</Label>
              <Select
                value={formulario.parametros.asignaturaOrigen}
                onValueChange={(value) =>
                  setFormulario((prev) => ({
                    ...prev,
                    parametros: { ...prev.parametros, asignaturaOrigen: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asignatura" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-white text-black">
                  {asignaturasMock.map((asig) => (
                    <SelectItem key={asig.id} value={asig.codigo}>
                      {asig.codigo} - {asig.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Sala Prohibida</Label>
              <Select
                value={formulario.parametros.salaProhibida}
                onValueChange={(value) =>
                  setFormulario((prev) => ({
                    ...prev,
                    parametros: { ...prev.parametros, salaProhibida: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="aula">Aula</SelectItem>
                  <SelectItem value="laboratorio">Laboratorio</SelectItem>
                  <SelectItem value="auditorio">Auditorio</SelectItem>
                  <SelectItem value="sala_computacion">Sala de Computación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "profesor_especialidad":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Asignatura</Label>
              <Select
                value={formulario.parametros.asignaturaOrigen}
                onValueChange={(value) =>
                  setFormulario((prev) => ({
                    ...prev,
                    parametros: { ...prev.parametros, asignaturaOrigen: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asignatura" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-white text-black">
                  {asignaturasMock.map((asig) => (
                    <SelectItem key={asig.id} value={asig.codigo}>
                      {asig.codigo} - {asig.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Especialidad Requerida</Label>
              <Input
                value={formulario.parametros.especialidadRequerida || ""}
                onChange={(e) =>
                  setFormulario((prev) => ({
                    ...prev,
                    parametros: {
                      ...prev.parametros,
                      especialidadRequerida: e.target.value,
                    },
                  }))
                }
                placeholder="Matemáticas, Física, etc."
              />
            </div>
          </div>
        );

      case "horario_conflicto":
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Día</Label>
              <Select
                value={formulario.parametros.diaRestriccion}
                onValueChange={(value) =>
                  setFormulario((prev) => ({
                    ...prev,
                    parametros: { ...prev.parametros, diaRestriccion: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar día" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="todos">Todos los días</SelectItem>
                  {diasSemana.map(({ valor, nombre }) => (
                    <SelectItem key={valor} value={valor.toString()}>
                      {nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hora Inicio</Label>
              <Input
                type="time"
                value={formulario.parametros.horaInicioRestriccion || ""}
                onChange={(e) =>
                  setFormulario((prev) => ({
                    ...prev,
                    parametros: {
                      ...prev.parametros,
                      horaInicioRestriccion: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Hora Fin</Label>
              <Input
                type="time"
                value={formulario.parametros.horaFinRestriccion || ""}
                onChange={(e) =>
                  setFormulario((prev) => ({
                    ...prev,
                    parametros: {
                      ...prev.parametros,
                      horaFinRestriccion: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de Restricción</Label>
          <Select
            value={formulario.tipo}
            onValueChange={(value: TipoRestriccion) =>
              setFormulario((prev) => ({ ...prev, tipo: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="prerrequisito">Prerrequisito</SelectItem>
              <SelectItem value="sala_prohibida">Sala Prohibida</SelectItem>
              <SelectItem value="horario_conflicto">Conflicto de Horario</SelectItem>
              <SelectItem value="profesor_especialidad">Especialidad de Profesor</SelectItem>
              <SelectItem value="secuencia_temporal">Secuencia Temporal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Descripción *</Label>
          <Input
            value={formulario.descripcion}
            onChange={(e) =>
              setFormulario((prev) => ({ ...prev, descripcion: e.target.value }))
            }
            placeholder="Descripción breve de la restricción"
          />
        </div>

        <div className="space-y-2">
          <Label>Mensaje de Error *</Label>
          <Textarea
            value={formulario.mensaje}
            onChange={(e) =>
              setFormulario((prev) => ({ ...prev, mensaje: e.target.value }))
            }
            placeholder="Mensaje que se mostrará cuando no se cumpla la restricción"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Select
              value={formulario.prioridad}
              onValueChange={(value: "alta" | "media" | "baja") =>
                setFormulario((prev) => ({ ...prev, prioridad: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <div className="flex items-center space-x-2 h-10">
              <Switch
                checked={formulario.activa}
                onCheckedChange={(checked: boolean) =>
                  setFormulario((prev) => ({ ...prev, activa: checked }))
                }
              />
              <span className="text-sm">
                {formulario.activa ? "Activa" : "Inactiva"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4>Parámetros Específicos</h4>
        {renderParametrosEspecificos()}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="btn-outline" onClick={modalCerrar}>
          Cancelar
        </button>
        <button className="btn-primary" onClick={handleSubmit}>
          {editando ? "Actualizar" : "Agregar"} Restricción
        </button>
      </div>
    </div>
  );
}
