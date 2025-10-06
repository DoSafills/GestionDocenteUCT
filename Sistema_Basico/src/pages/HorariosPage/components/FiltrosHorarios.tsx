import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Search, X, HelpCircle, Calendar, MapPin, BookOpen, Filter } from "lucide-react";
import type { FiltrosHorariosProps } from "../types/componentes";

export function FiltrosHorarios({
  filtros,
  onFiltroChange,
  salas,
  profesores,
}: FiltrosHorariosProps) {
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false); // desplegable

  const handleBusquedaChange = (valor: string) => {
    setBusquedaGlobal(valor);
    if (valor.trim()) {
      const filtrosBusqueda: any = {};

      // Nota: Sin filtro de bloques. No interpretamos valores numéricos como bloqueId.

      // Buscar por docente (por nombre)
      const docente = profesores.find(p =>
        String(p.nombre || "").toLowerCase().includes(valor.toLowerCase())
      );
      if (docente) filtrosBusqueda.docenteRut = String((docente as any).id);

      // Buscar por sala/edificio
      const sala = salas.find(s =>
        s.codigo?.toLowerCase().includes(valor.toLowerCase()) ||
        s.numero?.toLowerCase().includes(valor.toLowerCase()) ||
        s.edificio?.codigo?.toLowerCase().includes(valor.toLowerCase()) ||
        s.edificio?.nombre?.toLowerCase().includes(valor.toLowerCase())
      );
      if (sala) {
        filtrosBusqueda.salaId = sala.codigo.includes('_')
          ? sala.codigo.split('_')[0]
          : sala.codigo;
      }

      onFiltroChange({ ...filtros, ...filtrosBusqueda });
    } else {
      limpiarFiltros();
    }
  };

  const handleFiltroRapido = (campo: keyof typeof filtros, valor: any) => {
    onFiltroChange({ ...filtros, [campo]: filtros[campo] === valor ? undefined : valor });
  };

  const limpiarFiltros = () => {
    setBusquedaGlobal('');
    onFiltroChange({
      seccionId: undefined,
      docenteRut: undefined,
      salaId: undefined,
      dia: undefined,
      estado: undefined,
      // bloqueId intencionalmente omitido (no se usa)
    });
  };

  const hayFiltrosActivos =
    Object.values(filtros).some((v: any) => v !== undefined && v !== '') || busquedaGlobal.length > 0;

  const diasSemana = [
    { id: 1, nombre: 'Lunes', corto: 'L' },
    { id: 2, nombre: 'Martes', corto: 'M' },
    { id: 3, nombre: 'Miércoles', corto: 'X' },
    { id: 4, nombre: 'Jueves', corto: 'J' },
    { id: 5, nombre: 'Viernes', corto: 'V' },
    { id: 6, nombre: 'Sábado', corto: 'S' },
  ];

  const estados = ['activo', 'cancelado', 'reprogramado'] as const;

  const edificios = Array.from(
    new Set(salas.map((s: any) => s.edificio?.codigo || s.edificio?.nombre).filter(Boolean))
  ) as string[];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Búsqueda de Horarios</CardTitle>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Ayuda">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ayuda de Búsqueda</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                  <p>• Docente (por nombre): Ana, Luis, etc.</p>
                  <p>• Sala o edificio: CJP07_101, CJP07</p>
                  <p>• Día: usa los botones de días</p>
                  <p>• Estado: usa los botones de estado</p>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={() => setMenuAbierto(!menuAbierto)}>
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            {hayFiltrosActivos && (
              <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {menuAbierto && (
        <CardContent className="space-y-4">
          {/* Search blanca con letras negras */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar sección, docente, sala..."
              value={busquedaGlobal}
              onChange={(e) => handleBusquedaChange(e.target.value)}
              className="pl-10 bg-white text-black placeholder:text-gray-500 border border-gray-300"
            />
          </div>

          {/* Días */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Días:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {diasSemana.map((dia) => (
                <Button
                  key={dia.id}
                  variant={filtros.dia === dia.id ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleFiltroRapido('dia', filtros.dia === dia.id ? undefined : dia.id)}
                >
                  {dia.corto}
                </Button>
              ))}
            </div>
          </div>

          {/* Estados */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Estados:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {estados.map((estado) => (
                <Button
                  key={estado}
                  variant={filtros.estado === estado ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleFiltroRapido('estado', filtros.estado === estado ? undefined : estado)}
                >
                  {estado}
                </Button>
              ))}
            </div>
          </div>

          {/* Edificios */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Edificios:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {edificios.map((edif) => (
                <Button
                  key={edif}
                  variant={filtros.salaId === edif ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleFiltroRapido('salaId', filtros.salaId === edif ? undefined : edif)}
                >
                  {edif}
                </Button>
              ))}
            </div>
          </div>

          {/* Chips de filtros activos */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filtros.docenteRut && (
              <Badge className="bg-green-100 text-green-800">
                Docente: {profesores.find(p => String((p as any).id) === String(filtros.docenteRut))?.nombre ?? filtros.docenteRut}
              </Badge>
            )}
            {filtros.salaId && <Badge className="bg-purple-100 text-purple-800">Edif/Sala: {filtros.salaId}</Badge>}
            {typeof filtros.dia === "number" && <Badge className="bg-cyan-100 text-cyan-800">Día: {filtros.dia}</Badge>}
            {filtros.estado && <Badge className="bg-gray-100 text-gray-800">Estado: {filtros.estado}</Badge>}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
