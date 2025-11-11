import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Search, X, HelpCircle, Calendar, BookOpen, Filter, Building, GraduationCap } from "lucide-react";
import type { FiltrosHorariosProps } from "../types/componentes";

export function FiltrosHorarios({
  filtros,
  onFiltroChange,
  salas,
  profesores,
  asignaturas,
}: FiltrosHorariosProps) {
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleBusquedaChange = (valor: string) => {
    setBusquedaGlobal(valor);
    onFiltroChange({ ...filtros, busqueda: valor.trim() || undefined });
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
      edificioId: undefined,
      campusId: undefined,
      carrera: undefined,
      dia: undefined,
      estado: undefined,
      busqueda: undefined,
    });
  };

  const hayFiltrosActivos =
    Object.values(filtros).some((v: any) => v !== undefined && v !== '') || busquedaGlobal.length > 0;

  const diasSemana = [
    { id: 1, nombre: 'Lunes', corto: 'L' },
    { id: 2, nombre: 'Martes', corto: 'M' },
    { id: 3, nombre: 'Miércoles', corto: 'X' },
    { id: 4, nombre: 'Jueves', corto: 'J' },
    { id: 5, nombre: 'Viernes', corto: 'V' }
  ];

  const estados = ['activo', 'cancelado', 'reprogramado'] as const;

  const edificios = Array.from(
    new Set(
      salas
        .map((s: any) => {
          const codigo = s.edificio?.codigo || s.codigo;
          if (!codigo) return null;
          const match = codigo.match(/^([A-Z]+\d+)/);
          return match ? match[1] : codigo.split('-')[0];
        })
        .filter(Boolean)
    )
  ).sort();

  const carreras = Array.from(
    new Set(asignaturas.map((a: any) => a.carrera).filter(Boolean))
  ).sort();

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
                  <p>• <strong>Búsqueda:</strong> busca en asignatura, docente, sala y sección</p>
                  <p>• <strong>Carrera:</strong> filtra por carrera específica</p>
                  <p>• <strong>Edificio:</strong> filtra por edificio específico (CJP07, CJP01, etc.)</p>
                  <p>• <strong>Día:</strong> filtra por día de la semana</p>
                  <p>• <strong>Estado:</strong> activo, cancelado o reprogramado</p>
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por asignatura, docente o sala..."
              value={busquedaGlobal}
              onChange={(e) => handleBusquedaChange(e.target.value)}
              className="pl-10 bg-white text-black placeholder:text-gray-500 border border-gray-300"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">Carrera:</span>
            </div>
            <Select
              value={filtros.carrera || "todas"}
              onValueChange={(value) => handleFiltroRapido('carrera', value === "todas" ? undefined : value)}
            >
              <SelectTrigger className="w-full bg-white border-gray-300">
                <SelectValue placeholder="Todas las carreras" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 border border-gray-200 shadow-lg">
                <SelectItem value="todas">Todas las carreras</SelectItem>
                {carreras.map((carrera) => (
                  <SelectItem key={carrera} value={carrera}>
                    {carrera}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                  className="h-8 px-3 capitalize"
                  onClick={() => handleFiltroRapido('estado', filtros.estado === estado ? undefined : estado)}
                >
                  {estado}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4" />
              <span className="text-sm font-medium">Edificios:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {edificios.map((edif) => (
                <Button
                  key={edif}
                  variant={filtros.edificioId === edif ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleFiltroRapido('edificioId', filtros.edificioId === edif ? undefined : edif)}
                >
                  {edif}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filtros.busqueda && (
              <Badge className="bg-blue-100 text-blue-800">
                Búsqueda: {filtros.busqueda}
              </Badge>
            )}
            {filtros.docenteRut && (
              <Badge className="bg-green-100 text-green-800">
                Docente: {profesores.find(p => String((p as any).id) === String(filtros.docenteRut))?.nombre ?? filtros.docenteRut}
              </Badge>
            )}
            {filtros.carrera && (
              <Badge className="bg-indigo-100 text-indigo-800">
                Carrera: {filtros.carrera}
              </Badge>
            )}
            {filtros.edificioId && (
              <Badge className="bg-purple-100 text-purple-800">
                Edificio: {filtros.edificioId}
              </Badge>
            )}
            {typeof filtros.dia === "number" && (
              <Badge className="bg-cyan-100 text-cyan-800">
                Día: {diasSemana.find(d => d.id === filtros.dia)?.nombre}
              </Badge>
            )}
            {filtros.estado && (
              <Badge className="bg-gray-100 text-gray-800 capitalize">
                Estado: {filtros.estado}
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
