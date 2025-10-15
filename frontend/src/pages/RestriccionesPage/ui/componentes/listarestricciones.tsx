import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { CheckCircle, XCircle, Edit, Trash2, AlertTriangle } from "lucide-react";

import type { RestriccionAcademica } from "../../Domain/entities/restriccionespage/RestriccionAcademica";
import { getTipoIcon, getPrioridadColor, getAsignaturaNombre } from "../../services/utils";

// Usecases
import { filtrarRestricciones } from "../../application/usecases/FiltrarRestricciones";
import { toggleActivarRestriccion } from "../../application/usecases/ToggleRestriccion";
import { abrirConfirmacion } from "../../application/usecases/ConfirmarAccionRestriccion";

// ✅ Tipo actualizado para incluir 'editar'
export type AccionRestriccion = "crear" | "eliminar" | "editar" | null;

export interface ListaRestriccionesProps {
  restricciones: RestriccionAcademica[];
  setRestricciones: React.Dispatch<React.SetStateAction<RestriccionAcademica[]>>;
  busqueda: string;
  filtroTipo: string;
  filtroPrioridad: string;
  filtroActiva: string;
  setModalAbierto: (open: boolean) => void;
  abrirModalParaEditar: (restriccion: RestriccionAcademica) => void;
  setDialogConfirmacionAbierto: (open: boolean) => void;
  setAccionAConfirmar: (accion: AccionRestriccion) => void;
  setRestriccionObjetivo: (r: RestriccionAcademica | null) => void;
  handleEliminar: (r: RestriccionAcademica) => Promise<void>;
}

export function ListaRestricciones({
  restricciones,
  setRestricciones,
  busqueda,
  filtroTipo,
  filtroPrioridad,
  filtroActiva,
  setModalAbierto,
  abrirModalParaEditar,
  setDialogConfirmacionAbierto,
  setAccionAConfirmar,
  setRestriccionObjetivo,
  handleEliminar,
}: ListaRestriccionesProps) {

  // 🔹 Manejar toggle de activación
  const handleToggle = (id: string) => {
    setRestricciones(toggleActivarRestriccion(restricciones, id));
  };

  // 🔹 Abrir diálogo de confirmación
  const handleAbrirConfirmacion = (accion: AccionRestriccion, restriccion?: RestriccionAcademica) => {
    const estado = abrirConfirmacion(accion, restriccion);
    setAccionAConfirmar(estado.accion);
    setRestriccionObjetivo(estado.restriccionObjetivo);
    setDialogConfirmacionAbierto(estado.abierto);
  };

  // 🔹 Abrir modal de edición
  const editarRestriccion = (restriccion: RestriccionAcademica) => {
    abrirModalParaEditar(restriccion);
  };

  // 🔹 Filtrar restricciones usando el usecase
  const restriccionesFiltradas = filtrarRestricciones(restricciones, {
    busqueda,
    tipo: filtroTipo,
    prioridad: filtroPrioridad,
    activa: filtroActiva,
  });

  return (
    <div className="space-y-4">
      {restriccionesFiltradas.map(restriccion => (
        <Card key={restriccion.id} className={`hover:shadow-md transition-shadow ${!restriccion.activa ? 'opacity-60' : ''}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">{getTipoIcon(restriccion.tipo)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{restriccion.descripcion}</CardTitle>
                    <Badge variant="outline" className="text-xs">{restriccion.tipo.replace('_', ' ')}</Badge>
                    <Badge className={getPrioridadColor(restriccion.prioridad ?? "media")}>{restriccion.prioridad ?? "media"}</Badge>
                    <div className="flex items-center gap-1">
                      {restriccion.activa ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {restriccion.activa ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleToggle(restriccion.id)}>
                  {restriccion.activa ? <XCircle className="w-4 h-4 text-red-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editarRestriccion(restriccion)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleAbrirConfirmacion("eliminar", restriccion)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="ml-5">{restriccion.mensaje}</AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {restriccion.parametros?.asignaturaOrigen && (
                <div>
                  <strong>Asignatura Origen:</strong> {getAsignaturaNombre(restriccion.parametros.asignaturaOrigen ?? "")}
                </div>
              )}
              {restriccion.parametros?.asignaturaDestino && (
                <div>
                  <strong>Asignatura Destino:</strong> {getAsignaturaNombre(restriccion.parametros.asignaturaDestino ?? "")}
                </div>
              )}
              {restriccion.parametros?.salaProhibida && <div><strong>Sala Prohibida:</strong> {restriccion.parametros.salaProhibida}</div>}
              {restriccion.parametros?.especialidadRequerida && <div><strong>Especialidad Requerida:</strong> {restriccion.parametros.especialidadRequerida}</div>}
              {restriccion.parametros?.diaRestriccion && <div><strong>Día:</strong> {restriccion.parametros.diaRestriccion}</div>}
              {restriccion.parametros?.horaInicioRestriccion && restriccion.parametros?.horaFinRestriccion && (
                <div><strong>Horario:</strong> {restriccion.parametros.horaInicioRestriccion} - {restriccion.parametros.horaFinRestriccion}</div>
              )}
            </div>

            <div className="text-xs text-muted-foreground border-t pt-2">
              Creado el {restriccion.fechaCreacion} por {restriccion.creadoPor}
            </div>
          </CardContent>
        </Card>
      ))}

      {restriccionesFiltradas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">No hay restricciones que coincidan con los filtros</CardContent>
        </Card>
      )}
    </div>
  );
}
