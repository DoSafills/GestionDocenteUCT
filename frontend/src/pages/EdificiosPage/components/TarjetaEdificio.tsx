import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Plus, Edit, Trash2, Monitor } from "lucide-react";
import type { EdificioDTO } from "@/domain/edificios/types";
import type { SalaDTO } from "@/domain/salas/types";
import { TarjetaSala } from "./TarjetaSala";

interface TarjetaEdificioProps {
  edificio: EdificioDTO;
  campusNombre: string;
  salas: SalaDTO[];
  onAgregarSala: () => void;
  onEditarEdificio: () => void;
  onEliminarEdificio: () => void;
  onEditarSala: (sala: SalaDTO) => void;
  onEliminarSala: (salaId: number) => void;
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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="flex items-center gap-2">
                {edificio.nombre}
                {edificio.pisos != null && (
                  <Badge variant="outline">
                    {edificio.pisos} {edificio.pisos === 1 ? "piso" : "pisos"}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Campus: {campusNombre}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onAgregarSala}>
              <Plus className="w-4 h-4 mr-1" />
              Agregar Sala
            </Button>
            <Button variant="ghost" size="sm" onClick={onEditarEdificio}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEliminarEdificio}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salas.map(sala => (
            <TarjetaSala
              key={sala.id}
              sala={sala}
              onEditar={() => onEditarSala(sala)}
              onEliminar={() => onEliminarSala(sala.id)}
            />
          ))}
        </div>

        {salas.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Monitor className="w-8 h-8 mx-auto mb-2" />
            <p>No hay salas en este edificio</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={onAgregarSala}>
              Agregar primera sala
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};