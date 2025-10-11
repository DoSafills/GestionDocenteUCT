import { Card, CardContent } from "../../../components/ui/card";

interface ResumenProps {
  restricciones: any[];
}

export function ResumenRestricciones({ restricciones }: ResumenProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { color: "green-500", count: restricciones.filter(r => r.activa).length, label: "Activas" },
        { color: "red-500", count: restricciones.filter(r => r.prioridad === "alta").length, label: "Alta Prioridad" },
        { color: "blue-500", count: restricciones.filter(r => r.tipo === "prerrequisito").length, label: "Prerrequisitos" },
        { color: "gray-500", count: restricciones.length, label: "Total" }
      ].map((item, i) => (
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
