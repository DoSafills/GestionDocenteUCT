import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users } from "lucide-react";
import type { SalaDTO } from "@/domain/salas/types";

interface TarjetaSalaProps {
  sala: SalaDTO;
  onEditar: () => void;
  onEliminar: () => void;
}

export const TarjetaSala = ({ sala, onEditar, onEliminar }: TarjetaSalaProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{sala.codigo}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEditar}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEliminar}>
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{sala.tipo}</Badge>
          <Badge variant={sala.disponible ? "default" : "destructive"}>
            {sala.disponible ? "Disponible" : "No disponible"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>Capacidad: {sala.capacidad} Personas</span>
        </div>
        {sala.equipamiento && (
          <div className="space-y-1">
            <p className="text-sm">Equipamiento:</p>
            <div className="flex flex-wrap gap-1">
              {sala.equipamiento.split(',').map((equipo, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {equipo.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
