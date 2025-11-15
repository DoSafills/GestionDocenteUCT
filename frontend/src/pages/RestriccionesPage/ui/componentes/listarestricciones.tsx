import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Edit, Trash2, AlertTriangle, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

import type { RestriccionAcademica } from "@domain/entities/restriccionespage/RestriccionAcademica";
import { getTipoIcon, getPrioridadColor } from "../../services/utils";
import { filtrarRestricciones } from "../../application/usecases/FiltrarRestricciones";

export interface ListaRestriccionesProps {
  restricciones: RestriccionAcademica[];
  setRestricciones: React.Dispatch<React.SetStateAction<RestriccionAcademica[]>>;
  busqueda: string;
  filtroTipo: string;
  filtroPrioridad: string;
  filtroActiva: string;
  setModalAbierto: (open: boolean) => void;
  abrirModalParaEditar: (restriccion: RestriccionAcademica) => void;
  solicitarEliminar: (r: RestriccionAcademica) => void; // Solo notifica al padre
}

export function ListaRestricciones({
  restricciones,
  abrirModalParaEditar,
  solicitarEliminar,
  busqueda,
  filtroTipo,
  filtroPrioridad,
  filtroActiva,
}: ListaRestriccionesProps) {
  const restriccionesFiltradas = filtrarRestricciones(restricciones, {
    busqueda,
    tipo: filtroTipo,
    prioridad: filtroPrioridad,
    activa: filtroActiva,
  });

  const esImpar = restriccionesFiltradas.length % 2 !== 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {restriccionesFiltradas.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300 col-span-full">
          <CardContent className="text-center py-16">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No hay restricciones
            </h3>
            <p className="text-sm text-muted-foreground">
              {busqueda || filtroTipo !== "todos" || filtroPrioridad !== "todos" || filtroActiva !== "todos"
                ? "No se encontraron restricciones que coincidan con los filtros aplicados"
                : "Comienza creando tu primera restricción"}
            </p>
          </CardContent>
        </Card>
      )}

      {restriccionesFiltradas.map((restriccion, index) => {
        const esUltimoImpar = esImpar && index === restriccionesFiltradas.length - 1;
        
        return (
        <Card
          key={restriccion.id ?? Math.random().toString()}
          className={`transition-all hover:shadow-lg border-l-4 ${esUltimoImpar ? 'lg:col-span-2' : ''} ${
            !restriccion.activa 
              ? "opacity-60 border-l-gray-400 bg-gray-50" 
              : restriccion.prioridad === "alta"
              ? "border-l-red-500 bg-white"
              : restriccion.prioridad === "media"
              ? "border-l-yellow-500 bg-white"
              : "border-l-green-500 bg-white"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1 flex-shrink-0">
                  {getTipoIcon(restriccion.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    {restriccion.descripcion}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {restriccion.tipo.replace("_", " ")}
                    </Badge>
                    <Badge className={getPrioridadColor(restriccion.prioridad ?? "media")}>
                      {restriccion.prioridad ?? "media"}
                    </Badge>
                    <Badge variant={restriccion.activa ? "default" : "secondary"} className="gap-1">
                      {restriccion.activa ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Activa
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Inactiva
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Menú de acciones */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={() => abrirModalParaEditar(restriccion)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => solicitarEliminar(restriccion)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="ml-6 text-sm text-gray-700">
                {restriccion.mensaje}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}
