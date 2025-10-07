import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Calendar, Clock, MapPin, User, Eye, Edit } from "lucide-react";
import { getColorPorEstado } from "../constants";
import { formatearRangoHorario } from "../utils/formatters";
import type { ListaHorariosProps } from "../types/componentes";

export function ListaHorarios({
  horarios,
  onVerDetalle,
  onEditar,
  cargando = false
}: ListaHorariosProps) {

  if (cargando) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (horarios.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">No hay horarios disponibles</h3>
          <p className="text-muted-foreground">
            No se encontraron horarios que coincidan con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {horarios.map((horario) => (
        <Card key={horario.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className="w-4 h-16 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: '#3B82F6' }}
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{horario.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {horario.seccion.codigo}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getColorPorEstado(horario.estado)}>
                      {horario.estado}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVerDetalle(horario.clase_id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {onEditar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditar(horario)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{horario.horario.dia}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>
                  {formatearRangoHorario(horario.horario.hora_inicio, horario.horario.hora_fin)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  Sala {horario.sala.numero} ({horario.sala.edificio}) - Cap: {horario.sala.capacidad}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{horario.docente.nombre}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">

            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
