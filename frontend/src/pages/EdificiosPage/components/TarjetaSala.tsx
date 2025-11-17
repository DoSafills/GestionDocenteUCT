import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users, Package, CheckCircle, XCircle } from "lucide-react";
import type { SalaDTO } from "@/domain/salas/types";

interface TarjetaSalaProps {
  sala: SalaDTO;
  onEditar?: () => void;
  onEliminar?: () => void;
}

// Mapeo de tipos a colores y etiquetas
const tipoConfig: Record<string, { color: string; label: string }> = {
  aula: { color: "bg-blue-100 text-blue-800", label: "Aula" },
  laboratorio: { color: "bg-purple-100 text-purple-800", label: "Laboratorio" },
  auditorio: { color: "bg-amber-100 text-amber-800", label: "Auditorio" },
  oficina: { color: "bg-gray-100 text-gray-800", label: "Oficina" },
  sala_reuniones: { color: "bg-green-100 text-green-800", label: "Sala de Reuniones" },
};

export const TarjetaSala = ({ sala, onEditar, onEliminar }: TarjetaSalaProps) => {
  const esAdministrador = !!(onEditar || onEliminar);
  const config = tipoConfig[sala.tipo] || { color: "bg-gray-100 text-gray-800", label: sala.tipo };
  
  const equipamientoLista = sala.equipamiento 
    ? sala.equipamiento.split(',').map(e => e.trim()).filter(Boolean)
    : [];

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-2 bg-background" 
          style={{ borderLeftColor: sala.disponible ? '#22c55e' : '#ef4444' }}>
      <CardHeader className="pb-3 bg-background">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{sala.codigo}</CardTitle>
          </div>
          {esAdministrador && (
            <div className="flex gap-1 shrink-0">
              {onEditar && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEditar}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onEliminar && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEliminar}
                  className="h-8 w-8 p-0 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge className={config.color} variant="secondary">
            {config.label}
          </Badge>
          <Badge 
            variant={sala.disponible ? "default" : "destructive"}
            className="gap-1"
          >
            {sala.disponible ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Disponible
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                Ocupada
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0 bg-background">
        <div className="flex items-center gap-2 text-sm rounded-md p-2">
          <Users className="w-4 h-4 text-primary shrink-0" />
          <span className="font-medium">{sala.capacidad}</span>
          <span className="text-muted-foreground">persona{sala.capacidad !== 1 ? 's' : ''}</span>
        </div>
        
        {equipamientoLista.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>Equipamiento</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {equipamientoLista.map((equipo, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs font-normal"
                >
                  {equipo}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {!sala.equipamiento && (
          <p className="text-xs text-muted-foreground italic">
            Sin equipamiento registrado
          </p>
        )}
      </CardContent>
    </Card>
  );
};