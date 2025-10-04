import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ChevronUp, ChevronDown, Clock } from "lucide-react";

type Props = {
  valor: string;                   // "HH:MM" 24h
  onChange: (v: string) => void;   // "HH:MM" 24h
  disabled?: boolean;
  stepMinutos?: number;            // default 5
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
function to12(valor: string) {
  const [hRaw, mRaw] = (valor || "00:00").split(":").map(Number);
  const h = clamp(isNaN(hRaw) ? 0 : hRaw, 0, 23);
  const m = clamp(isNaN(mRaw) ? 0 : mRaw, 0, 59);
  const mer = h >= 12 ? "PM" : "AM";
  const h12 = (h % 12) || 12;
  return { h12, m, mer: mer as "AM" | "PM" };
}
function to24(h12: number, m: number, mer: "AM" | "PM") {
  let h = h12 % 12;
  if (mer === "PM") h += 12;
  const pad = (x: number) => x.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}`;
}

export default function SelectorHora({ valor, onChange, disabled, stepMinutos = 5 }: Props) {
  const init = React.useMemo(() => to12(valor), [valor]);
  const [open, setOpen] = React.useState(false);
  const [h12, setH12] = React.useState(init.h12);
  const [m, setM] = React.useState(init.m);
  const [mer, setMer] = React.useState<"AM" | "PM">(init.mer);

  React.useEffect(() => {
    const t = to12(valor);
    setH12(t.h12); setM(t.m); setMer(t.mer);
  }, [valor]);

  const commit = (nh = h12, nm = m, nmer = mer) => onChange(to24(nh, nm, nmer));

  const incH = () => { const nh = h12 === 12 ? 1 : h12 + 1; setH12(nh); commit(nh, m, mer); };
  const decH = () => { const nh = h12 === 1 ? 12 : h12 - 1; setH12(nh); commit(nh, m, mer); };
  const incM = () => { const nm = (m + stepMinutos + 60) % 60; setM(nm); commit(h12, nm, mer); };
  const decM = () => { const nm = (m - stepMinutos + 60) % 60; setM(nm); commit(h12, nm, mer); };

  const pad = (x: number) => x.toString().padStart(2, "0");
  const display = to12(valor);

  // clases reutilizadas para mantener simetría
  const btnIcon = "h-7 w-7 p-1";
  const icon = "h-3.5 w-3.5";
  const inputW = "w-16"; // 64px; si lo cambias, cambia ambas columnas por igual

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={!!disabled}
          className="w-full inline-flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {display.h12}:{pad(display.m)} {display.mer}
          </span>
          <span className="text-xs text-muted-foreground">Editar</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        className="w-auto min-w-[172px] p-3 bg-white text-gray-900 border rounded-md shadow-lg z-50"
      >
        {/* 3 columnas simétricas: 86px | 20px | 86px */}
        <div className="grid grid-cols-[60px_4px_60px] gap-2 items-center">
          {/* Columna Horas */}
          <div className="flex flex-col items-center">
            <Button variant="ghost" size="sm" className={btnIcon} onClick={incH} aria-label="Incrementar hora">
              <ChevronUp className={icon} />
            </Button>
            <Input
              value={pad(h12)}
              onChange={(e) => {
                const v = clamp(parseInt(e.target.value.replace(/\D/g, "") || "0", 10), 1, 12);
                setH12(v); commit(v, m, mer);
              }}
              onWheel={(e) => (e.deltaY < 0 ? incH() : decH())}
              className={`text-center ${inputW} text-sm py-1 bg-white font-mono`}
            />
            <Button variant="ghost" size="sm" className={btnIcon} onClick={decH} aria-label="Disminuir hora">
              <ChevronDown className={icon} />
            </Button>
          </div>

          {/* Columna ":" centrado */}
          <div className="flex flex-col items-center justify-center">
            <span className="select-none text-lg leading-6">:</span>
          </div>

          {/* Columna Minutos */}
          <div className="flex flex-col items-center">
            <Button variant="ghost" size="sm" className={btnIcon} onClick={incM} aria-label="Incrementar minutos">
              <ChevronUp className={icon} />
            </Button>
            <Input
              value={pad(m)}
              onChange={(e) => {
                const v = clamp(parseInt(e.target.value.replace(/\D/g, "") || "0", 10), 0, 59);
                setM(v); commit(h12, v, mer);
              }}
              onWheel={(e) => (e.deltaY < 0 ? incM() : decM())}
              className={`text-center ${inputW} text-sm py-1 bg-white font-mono`}
            />
            <Button variant="ghost" size="sm" className={btnIcon} onClick={decM} aria-label="Disminuir minutos">
              <ChevronDown className={icon} />
            </Button>
          </div>
        </div>

        {/* AM / PM */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant={mer === "AM" ? "default" : "outline"}
            className="py-1"
            onClick={() => { setMer("AM"); commit(h12, m, "AM"); }}
          >
            AM
          </Button>
          <Button
            variant={mer === "PM" ? "default" : "outline"}
            className="py-1"
            onClick={() => { setMer("PM"); commit(h12, m, "PM"); }}
          >
            PM
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
