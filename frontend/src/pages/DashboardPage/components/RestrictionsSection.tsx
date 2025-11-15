// src/pages/DashboardPage/components/RestrictionsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

type UltimaRestriccion = {
  id: string | number;
  tipo?: string;
  fecha: string; // YYYY-MM-DD
  descripcion?: string;
};

type RestriccionTop = {
  tipo: string;
  cantidad: number;
};

export default function RestrictionsSection({
  ultimasSemana,
  topTipos,
}: {
  ultimasSemana: UltimaRestriccion[];
  topTipos: RestriccionTop[];
}) {
  const hasUltimas = Array.isArray(ultimasSemana) && ultimasSemana.length > 0;
  const hasTop = Array.isArray(topTipos) && topTipos.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Últimas restricciones (7 días) */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Últimas restricciones (últimos 7 días)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!hasUltimas ? (
            <div className="text-sm text-muted-foreground">No hay restricciones recientes.</div>
          ) : (
            ultimasSemana.map((r) => (
              <div key={String(r.id)} className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">{r.tipo ?? "Restricción"}</div>
                  <div className="text-xs text-muted-foreground">{r.descripcion ?? "—"}</div>
                </div>
                <Badge variant="secondary" className="shrink-0">{r.fecha}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Top 4 tipos más solicitados */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Restricciones más solicitadas</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          {!hasTop ? (
            <div className="text-sm text-muted-foreground">Sin datos para agrupar por tipo.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topTipos.map(t => ({ name: t.tipo, cantidad: t.cantidad }))}
                layout="vertical"
                margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={140} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" name="Solicitudes" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
