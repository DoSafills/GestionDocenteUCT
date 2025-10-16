import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { CheckCircle, XCircle, Edit, Trash2, AlertTriangle } from "lucide-react";

import type { RestriccionAcademica } from "../../Domain/entities/restriccionespage/RestriccionAcademica";
import { getTipoIcon, getPrioridadColor } from "../../services/utils";

// Usecases
import { filtrarRestricciones } from "../../application/usecases/FiltrarRestricciones";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";

export interface ListaRestriccionesProps {
  restricciones: RestriccionAcademica[];
  setRestricciones: React.Dispatch<React.SetStateAction<RestriccionAcademica[]>>;
  busqueda: string;
  filtroTipo: string;
  filtroPrioridad: string;
  filtroActiva: string;
  setModalAbierto: (open: boolean) => void;
  abrirModalParaEditar: (restriccion: RestriccionAcademica) => void;
  handleToggle: (r: RestriccionAcademica) => Promise<void>;
  solicitarEliminar: (r: RestriccionAcademica) => void; // Solo notifica al padre
}

export function ListaRestricciones({
  restricciones,
  setRestricciones,
  setModalAbierto,
  abrirModalParaEditar,
  handleToggle,
  solicitarEliminar,
  busqueda,
  filtroTipo,
  filtroPrioridad,
  filtroActiva,
}: ListaRestriccionesProps) {
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [restriccionParaEliminar, setRestriccionParaEliminar] = useState<RestriccionAcademica | null>(null);

  const abrirDialogEliminar = (r: RestriccionAcademica) => {
    setRestriccionParaEliminar(r);
    setDialogAbierto(true);
  };

  const restriccionesFiltradas = filtrarRestricciones(restricciones, {
    busqueda,
    tipo: filtroTipo,
    prioridad: filtroPrioridad,
    activa: filtroActiva,
  });

  return (
    <>
      {restriccionesFiltradas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            No hay restricciones que coincidan con los filtros
          </CardContent>
        </Card>
      )}

      {restriccionesFiltradas.map((restriccion) => (
        <Card
          key={restriccion.id ?? Math.random().toString()}
          className={`hover:shadow-md transition-shadow ${!restriccion.activa ? "opacity-60" : ""}`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">{getTipoIcon(restriccion.tipo)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{restriccion.descripcion}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {restriccion.tipo.replace("_", " ")}
                    </Badge>
                    <Badge className={getPrioridadColor(restriccion.prioridad ?? "media")}>
                      {restriccion.prioridad ?? "media"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {restriccion.activa ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-xs text-muted-foreground">{restriccion.activa ? "Activa" : "Inactiva"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleToggle(restriccion)}>
                  {restriccion.activa ? <XCircle className="w-4 h-4 text-red-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => abrirModalParaEditar(restriccion)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => abrirDialogEliminar(restriccion)}>
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
          </CardContent>
        </Card>
      ))}

      {/* 🔹 Dialogo confirmación */}
      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="my-4">
            ¿Deseas eliminar la restricción "{restriccionParaEliminar?.descripcion}"?
          </p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogAbierto(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (restriccionParaEliminar) {
                  solicitarEliminar(restriccionParaEliminar); // Solo notifica al padre
                }
                setDialogAbierto(false);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
