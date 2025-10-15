import React, { useState } from "react";
import { Label } from "../../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Switch } from "../../../../components/ui/switch";
import { asignaturasMock } from "../../../../data/asignaturas";
import { diasSemana } from "../../services/utils"
import { FormularioRestriccionService } from "../../application/usecases/FormularioRestriccionService";
import type { Formulario } from "../../application/usecases/FormularioRestriccionService";
import type { TipoRestriccion } from "../../Domain/entities/restriccionespage/RestriccionAcademica";
interface FormularioProps {
  inicial: Formulario;
  onSubmit: (formulario: Formulario) => void;
  modalCerrar: () => void;
  editando: boolean;
}

export function FormularioRestriccion({ inicial, onSubmit, modalCerrar, editando }: FormularioProps) {
  const [formulario, setFormulario] = useState<Formulario>(inicial);
  const [errores, setErrores] = useState<string[]>([]);

  const handleSubmit = () => {
    const validacion = FormularioRestriccionService.validar(formulario);
    if (validacion.length) {
      setErrores(validacion);
      return;
    }
    onSubmit(formulario);
  };

  const renderParametrosEspecificos = () => {
    const p = formulario.parametros;
    switch (formulario.tipo) {
      case "prerrequisito":
      case "secuencia_temporal":
        return (
          <div className="grid grid-cols-2 gap-4">
            {["origen", "destino"].map((t) => (
              <div key={t} className="space-y-2">
                <Label>Asignatura {t === "origen" ? "Origen" : "Destino"}</Label>
                <Select
                  value={t === "origen" ? p.asignaturaOrigen : p.asignaturaDestino}
                  onValueChange={(value) =>
                    setFormulario(FormularioRestriccionService.actualizarParametro(formulario,
                      t === "origen" ? "asignaturaOrigen" : "asignaturaDestino",
                      value
                    ))
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto bg-white text-black">
                    {asignaturasMock.map(a => <SelectItem key={a.id} value={a.codigo}>{a.codigo} - {a.nombre}</SelectItem>)}
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
                value={p.asignaturaOrigen}
                onValueChange={(value) => setFormulario(FormularioRestriccionService.actualizarParametro(formulario, "asignaturaOrigen", value))}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-white text-black">
                  {asignaturasMock.map(a => <SelectItem key={a.id} value={a.codigo}>{a.codigo} - {a.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Sala Prohibida</Label>
              <Select
                value={p.salaProhibida}
                onValueChange={(value) => setFormulario(FormularioRestriccionService.actualizarParametro(formulario, "salaProhibida", value))}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar tipo" ></SelectValue></SelectTrigger>
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
                value={p.asignaturaOrigen}
                onValueChange={(value) => setFormulario(FormularioRestriccionService.actualizarParametro(formulario, "asignaturaOrigen", value))}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-white text-black">
                  {asignaturasMock.map(a => <SelectItem key={a.id} value={a.codigo}>{a.codigo} - {a.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Especialidad Requerida</Label>
              <Input
                value={p.especialidadRequerida || ""}
                onChange={e => setFormulario(FormularioRestriccionService.actualizarParametro(formulario, "especialidadRequerida", e.target.value))}
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
                value={p.diaRestriccion}
                onValueChange={(value) => setFormulario(FormularioRestriccionService.actualizarParametro(formulario, "diaRestriccion", value))}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar día" /></SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="todos">Todos los días</SelectItem>
                  {diasSemana.map(d => <SelectItem key={d.valor} value={d.valor}>{d.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hora Inicio</Label>
              <Input type="time" value={p.horaInicioRestriccion || ""} onChange={e => setFormulario(FormularioRestriccionService.actualizarParametro(formulario, "horaInicioRestriccion", e.target.value))}/>
            </div>
            <div className="space-y-2">
              <Label>Hora Fin</Label>
              <Input type="time" value={p.horaFinRestriccion || ""} onChange={e => setFormulario(FormularioRestriccionService.actualizarParametro(formulario, "horaFinRestriccion", e.target.value))}/>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {errores.length > 0 && (
        <div className="bg-red-100 text-red-700 p-2 rounded">
          {errores.map((e,i) => <div key={i}>{e}</div>)}
        </div>
      )}
      <div className="space-y-4">
        {/* Tipo, Descripción, Mensaje, Prioridad, Activa */}
        <div className="space-y-2">
          <Label>Tipo de Restricción</Label>
          <Select
            value={formulario.tipo}
            onValueChange={v => setFormulario(FormularioRestriccionService.actualizarCampo(formulario, "tipo", v as TipoRestriccion))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
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
          <Input value={formulario.descripcion} onChange={e => setFormulario(FormularioRestriccionService.actualizarCampo(formulario, "descripcion", e.target.value))} placeholder="Descripción breve de la restricción"/>
        </div>
        <div className="space-y-2">
          <Label>Mensaje de Error *</Label>
          <Textarea value={formulario.mensaje} onChange={e => setFormulario(FormularioRestriccionService.actualizarCampo(formulario, "mensaje", e.target.value))} rows={3} placeholder="Mensaje que se mostrará cuando no se cumpla la restricción"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Select value={formulario.prioridad} onValueChange={v => setFormulario(FormularioRestriccionService.actualizarCampo(formulario, "prioridad", v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Switch checked={formulario.activa} onCheckedChange={v => setFormulario(FormularioRestriccionService.actualizarCampo(formulario, "activa", v))}/>
              <span className="text-sm">{formulario.activa ? "Activa" : "Inactiva"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4>Parámetros Específicos</h4>
        {renderParametrosEspecificos()}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button className="btn-outline" onClick={modalCerrar}>Cancelar</button>
        <button className="btn-primary" onClick={handleSubmit}>{editando ? "Actualizar" : "Agregar"} Restricción</button>
      </div>
    </div>
  );
}
