// src/pages/DashboardPage/components/OccupancySection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { DoorOpen, DoorClosed, Building2 } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

type OcupacionEdificio = {
  id: string | number;
  nombre?: string;
  codigo?: string;
  campus?: string;
  ocupadas: number;
  libres: number;
  totalSalas: number;
};

export default function OccupancySection({
  totalPct,
  data,
  maxItems = 10,
}: {
  totalPct: number;
  data: OcupacionEdificio[];
  maxItems?: number;
}) {
  const sorted = [...data].sort((a, b) => b.totalSalas - a.totalSalas);
  const top = sorted.slice(0, maxItems);

  const COLOR_OCUP = "#ef4444";
  const COLOR_LIBRE = "#22c55e";
  const COLOR_RING_BG = "hsl(var(--muted, 240 5% 22%))";

  const totalO = data.reduce((acc, e) => acc + e.ocupadas, 0);
  const totalL = data.reduce((acc, e) => acc + e.libres, 0);
  const donut = [
    { name: "Ocupadas", value: totalO, fill: COLOR_OCUP },
    { name: "Libres", value: totalL, fill: COLOR_LIBRE },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Donut Total */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Ocupación Total
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] flex flex-col">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donut}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  strokeWidth={0}
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {donut.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2">
            <Progress value={totalPct} />
            <div className="mt-1 text-sm text-muted-foreground">{totalPct}% ocupado</div>
          </div>
        </CardContent>
      </Card>

      {/* Barras horizontales: Libres vs Ocupadas por edificio */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Salas por edificio (Libres vs Ocupadas)</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top.map(e => ({
                name: e.nombre ?? e.codigo ?? `Edificio ${e.id}`,
                libres: e.libres,
                ocupadas: e.ocupadas,
              }))}
              layout="vertical"
              margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={140} />
              <Tooltip />
              <Legend />
              <Bar dataKey="libres" name="Libres" fill={COLOR_LIBRE} radius={[0, 6, 6, 0]} />
              <Bar dataKey="ocupadas" name="Ocupadas" fill={COLOR_OCUP} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tarjetas por edificio */}
      <div className="lg:col-span-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((e) => {
          const pct = e.totalSalas > 0 ? Math.round((e.ocupadas / e.totalSalas) * 100) : 0;
          return (
            <Card key={String(e.id)} className="group relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {e.nombre ?? e.codigo ?? `Edificio ${e.id}`}
                  </CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {e.totalSalas} salas
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <RingGauge percent={pct} color={COLOR_OCUP} bg={COLOR_RING_BG} />
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <DoorClosed className="h-4 w-4" />
                    <span>Ocupadas:</span>
                    <strong>{e.ocupadas}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <DoorOpen className="h-4 w-4" />
                    <span>Libres:</span>
                    <strong>{e.libres}</strong>
                  </div>
                  <div className="text-muted-foreground">{pct}% ocupado</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function RingGauge({
  percent, size = 84, stroke = 10, color = "#ef4444", bg = "#27272a"
}: { percent: number; size?: number; stroke?: number; color?: string; bg?: string; }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dash = (clamped / 100) * C;
  const rest = C - dash;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke={bg} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={`${dash} ${rest}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 rotate-90 flex items-center justify-center">
        <span className="text-sm font-semibold">{clamped}%</span>
      </div>
    </div>
  );
}
