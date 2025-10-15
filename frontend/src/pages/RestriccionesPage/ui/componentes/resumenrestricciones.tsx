import { Card, CardContent } from "../../../../components/ui/card";
import type { RestriccionAcademica } from "../../Domain/entities/restriccionespage/RestriccionAcademica";
import { generarResumenRestricciones, ResumenStats } from "../../application/usecases/ResumeRestricciones";

interface ResumenProps {
  restricciones: RestriccionAcademica[];
}

export function ResumenRestricciones({ restricciones }: ResumenProps) {
  const items: ResumenStats[] = generarResumenRestricciones(restricciones);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 bg-${item.color} rounded-full`}></div>
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
