// src/pages/DashboardPage/components/TopStatsBar.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Building2, DoorClosed, DoorOpen, LayoutGrid } from "lucide-react";

export default function TopStatsBar({
  ocupacionPct,
  totalOcupadas,
  totalLibres,
  edificiosTotal,
  salasTotal,
}: {
  ocupacionPct: number;
  totalOcupadas: number;
  totalLibres: number;
  edificiosTotal: number;
  salasTotal: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Ocupación global</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{ocupacionPct}%</div>
          <div className="mt-2"><Progress value={ocupacionPct} /></div>
          <div className="mt-1 text-xs text-muted-foreground">Salas ocupadas / total</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DoorClosed className="h-4 w-4" /> Ocupadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalOcupadas}</div>
          <div className="text-xs text-muted-foreground">Salas en uso</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DoorOpen className="h-4 w-4" /> Libres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalLibres}</div>
          <div className="text-xs text-muted-foreground">Salas disponibles</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Edificios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{edificiosTotal}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <LayoutGrid className="h-3.5 w-3.5" /> {salasTotal} salas totales
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
