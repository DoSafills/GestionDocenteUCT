import { Card, CardContent } from "../../../../components/ui/card";
import { CheckCircle, AlertCircle, Clock, ListChecks } from "lucide-react";
import type { RestriccionAcademica } from "@domain/entities/restriccionespage/RestriccionAcademica";
import { generarResumenRestricciones } from "../../application/usecases/ResumeRestricciones";
import type { ResumenStats } from "../../application/usecases/ResumeRestricciones";

interface ResumenProps {
  restricciones: RestriccionAcademica[];
}

export function ResumenRestricciones({ restricciones }: ResumenProps) {
  const items: ResumenStats[] = generarResumenRestricciones(restricciones);

  // Mapeo de iconos por color
  const iconMap: Record<string, React.ReactNode> = {
    "green-500": <CheckCircle className="w-6 h-6 text-green-600" />,
    "red-500": <AlertCircle className="w-6 h-6 text-red-600" />,
    "blue-500": <Clock className="w-6 h-6 text-blue-600" />,
    "purple-500": <ListChecks className="w-6 h-6 text-purple-600" />,
    "gray-500": <ListChecks className="w-6 h-6 text-gray-600" />,
  };

  // Mapeo de colores de fondo para las cards
  const bgColorMap: Record<string, string> = {
    "green-500": "bg-green-50 border-green-200 hover:bg-green-100",
    "red-500": "bg-red-50 border-red-200 hover:bg-red-100",
    "blue-500": "bg-blue-50 border-blue-200 hover:bg-blue-100",
    "purple-500": "bg-purple-50 border-purple-200 hover:bg-purple-100",
    "gray-500": "bg-gray-50 border-gray-200 hover:bg-gray-100",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <Card 
          key={i} 
          className={`border-2 transition-all hover:shadow-md ${bgColorMap[item.color] || "bg-gray-50 border-gray-200"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* Icono */}
              <div className="flex-shrink-0">
                {iconMap[item.color] || <ListChecks className="w-6 h-6" />}
              </div>

              {/* Contenido */}
              <div className="flex flex-col items-end">
                <p className="text-3xl font-bold text-gray-900">{item.count}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
