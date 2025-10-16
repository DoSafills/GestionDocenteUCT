import { Card, CardContent } from "../../../../components/ui/card";
import type { RestriccionAcademica } from "../../Domain/entities/restriccionespage/RestriccionAcademica";
import { generarResumenRestricciones } from "../../application/usecases/ResumeRestricciones";
import type { ResumenStats } from "../../application/usecases/ResumeRestricciones";

interface ResumenProps {
  restricciones: RestriccionAcademica[];
}

export function ResumenRestricciones({ restricciones }: ResumenProps) {
  const items: ResumenStats[] = generarResumenRestricciones(restricciones);

  // Mapeo de colores permitidos en Tailwind
  const colorMap: Record<string, string> = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-500",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {/* Indicador de color */}
              <div className={`w-2 h-2 ${colorMap[item.color] || "bg-gray-500"} rounded-full`}></div>

              {/* Contenido del resumen */}
              <div>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
