import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Plus, Edit, Trash2, Monitor, Layers } from "lucide-react";
import type { EdificioDTO } from "@/domain/edificios/types";
import type { SalaDTO } from "@/domain/salas/types";
import { TarjetaSala } from "./TarjetaSala";
import { useMemo } from "react";

interface TarjetaEdificioProps {
  edificio: EdificioDTO;
  campusNombre: string;
  salas: SalaDTO[];
  onAgregarSala?: () => void;
  onEditarEdificio?: () => void;
  onEliminarEdificio?: () => void;
  onEditarSala?: (sala: SalaDTO) => void;
  onEliminarSala?: (salaId: number) => void;
}

export const TarjetaEdificio = ({
  edificio,
  campusNombre,
  salas,
  onAgregarSala,
  onEditarEdificio,
  onEliminarEdificio,
  onEditarSala,
  onEliminarSala,
}: TarjetaEdificioProps) => {
  // Calcular estadísticas de las salas
  const estadisticas = useMemo(() => {
    const total = salas.length;
    const disponibles = salas.filter(s => s.disponible).length;
    const capacidadTotal = salas.reduce((sum, s) => sum + (s.capacidad || 0), 0);
    
    return { total, disponibles, capacidadTotal };
  }, [salas]);

  const esAdministrador = !!(onAgregarSala || onEditarEdificio || onEliminarEdificio);

  return (
    <Card className="overflow-hidden bg-background">
      <CardHeader className="bg-background border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 flex-wrap">
                <span className="truncate">{edificio.nombre}</span>
                {edificio.pisos != null && (
                  <Badge variant="outline" className="shrink-0">
                    <Layers className="w-3 h-3 mr-1" />
                    {edificio.pisos} {edificio.pisos === 1 ? "piso" : "pisos"}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">Campus: {campusNombre}</span>
              </div>
              
              {/* Estadísticas */}
              {estadisticas.total > 0 && (
                <div className="flex gap-3 mt-3 text-sm">
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{estadisticas.total}</strong> sala{estadisticas.total !== 1 ? 's' : ''}
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-green-600">{estadisticas.disponibles}</strong> disponible{estadisticas.disponibles !== 1 ? 's' : ''}
                  </span>
                  <span className="text-muted-foreground">
                    Capacidad: <strong className="text-foreground">{estadisticas.capacidadTotal}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {esAdministrador && (
            <div className="flex gap-2 shrink-0">
              {onAgregarSala && (
                <Button variant="outline" size="sm" onClick={onAgregarSala}>
                  <Plus className="w-4 h-4 mr-1" />
                  Sala
                </Button>
              )}
              {onEditarEdificio && (
                <Button variant="ghost" size="sm" onClick={onEditarEdificio}>
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onEliminarEdificio && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEliminarEdificio}
                  className="hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 bg-background">
        {salas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salas.map(sala => (
              <TarjetaSala
                key={sala.id}
                sala={sala}
                onEditar={onEditarSala ? () => onEditarSala(sala) : undefined}
                onEliminar={onEliminarSala ? () => onEliminarSala(sala.id) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <Monitor className="w-8 h-8" />
            </div>
            <p className="text-base font-medium mb-1">No hay salas registradas</p>
            <p className="text-sm mb-4">Este edificio aún no tiene salas asignadas</p>
            {onAgregarSala && (
              <Button variant="outline" onClick={onAgregarSala}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar primera sala
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};