import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Search, X, HelpCircle, Calendar, MapPin, Users, BookOpen, Clock, Filter } from "lucide-react";

// Definir la interfaz directamente aquí para evitar problemas de importación
interface FiltrosHorariosProps {
  filtros: any;
  onFiltroChange: (filtros: any) => void;
  salas: any[];
  profesores: any[];
  asignaturas: any[];
}

export function FiltrosHorarios({
  filtros,
  onFiltroChange,
  salas,
  profesores,
  asignaturas
}: FiltrosHorariosProps) {
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [filtrosAvanzadosAbiertos, setFiltrosAvanzadosAbiertos] = useState(false);

  const handleBusquedaChange = (valor: string) => {
    setBusquedaGlobal(valor);
    
    if (valor.trim()) {
      const filtrosBusqueda: any = {};
      
      // Detectar tipo de búsqueda basado en patrones
      if (/^\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]$/i.test(valor)) {
        filtrosBusqueda.docenteRut = valor;
      }
      else if (/^[A-Z]{3}\d{4}-\d{4}-\d$/i.test(valor)) {
        filtrosBusqueda.seccionId = valor;
      }
      else if (/^\d+$/.test(valor)) {
        filtrosBusqueda.bloqueId = valor;
      }
      else {
        // Buscar en nombres de docentes
        const docenteEncontrado = profesores.find(p => 
          `${p.nombre} ${p.apellido}`.toLowerCase().includes(valor.toLowerCase())
        );
        if (docenteEncontrado) {
          filtrosBusqueda.docenteRut = docenteEncontrado.docente_rut;
        }
        
        // Buscar en códigos de sala
        const salaEncontrada = salas.find(s => 
          s.codigo?.toLowerCase().includes(valor.toLowerCase()) ||
          s.numero?.toLowerCase().includes(valor.toLowerCase()) ||
          s.edificio?.nombre?.toLowerCase().includes(valor.toLowerCase())
        );
        if (salaEncontrada) {
          filtrosBusqueda.salaId = salaEncontrada.codigo;
        }
      }
      
      onFiltroChange(filtrosBusqueda);
    } else {
      limpiarFiltros();
    }
  };

  const handleFiltroRapido = (campo: string, valor: any) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    onFiltroChange(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    setBusquedaGlobal('');
    onFiltroChange({
      seccionId: undefined,
      docenteRut: undefined,
      salaId: undefined,
      bloqueId: undefined,
      dia: undefined,
      estado: undefined
    });
  };

  const hayFiltrosActivos = Object.values(filtros).some(valor => 
    valor !== undefined && valor !== ''
  ) || busquedaGlobal.length > 0;

  const diasSemana = [
    { id: 1, nombre: 'Lunes', corto: 'L' },
    { id: 2, nombre: 'Martes', corto: 'M' },
    { id: 3, nombre: 'Miércoles', corto: 'X' },
    { id: 4, nombre: 'Jueves', corto: 'J' },
    { id: 5, nombre: 'Viernes', corto: 'V' },
    { id: 6, nombre: 'Sábado', corto: 'S' },
  ];

  const bloques = [
    { id: 1, nombre: 'Bloque 1', horario: '08:00-09:30' },
    { id: 2, nombre: 'Bloque 2', horario: '09:45-11:15' },
    { id: 3, nombre: 'Bloque 3', horario: '11:30-13:00' },
    { id: 4, nombre: 'Bloque 4', horario: '14:00-15:30' },
    { id: 5, nombre: 'Bloque 5', horario: '15:45-17:15' },
    { id: 6, nombre: 'Bloque 6', horario: '17:30-19:00' },
  ];

  const estados = [
    { id: 'activo', nombre: 'Activo', color: 'bg-green-100 text-green-800' },
    { id: 'cancelado', nombre: 'Cancelado', color: 'bg-red-100 text-red-800' },
    { id: 'reprogramado', nombre: 'Reprogramado', color: 'bg-yellow-100 text-yellow-800' },
  ];

  // Obtener edificios únicos
  const edificios = [...new Set(salas.map(s => s.edificio?.nombre).filter(Boolean))];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Búsqueda de Horarios</CardTitle>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ayuda de Búsqueda</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Parámetros de búsqueda:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Código de sección:</strong> MAT1105-2025-1</li>
                      <li>• <strong>RUT docente:</strong> 12.345.678-9</li>
                      <li>• <strong>ID de bloque:</strong> 1, 2, 3...</li>
                      <li>• <strong>Nombre docente:</strong> Juan Pérez</li>
                      <li>• <strong>Sala:</strong> CS01_125, Aula 201</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltrosAvanzadosAbiertos(!filtrosAvanzadosAbiertos)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            {hayFiltrosActivos && (
              <Button
                variant="outline"
                size="sm"
                onClick={limpiarFiltros}
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Búsqueda global */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por código de sección, docente, sala, bloque..."
            value={busquedaGlobal}
            onChange={(e) => handleBusquedaChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros rápidos por botones */}
        <div className="space-y-4">
          {/* Días de la semana */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Días:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {diasSemana.map((dia) => (
                <Button
                  key={dia.id}
                  variant={filtros.dia === dia.nombre ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleFiltroRapido('dia', 
                    filtros.dia === dia.nombre ? undefined : dia.nombre
                  )}
                >
                  {dia.corto}
                </Button>
              ))}
            </div>
          </div>

          {/* Bloques */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Bloques:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {bloques.map((bloque) => (
                <Button
                  key={bloque.id}
                  variant={filtros.bloqueId === bloque.id.toString() ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleFiltroRapido('bloqueId', 
                    filtros.bloqueId === bloque.id.toString() ? undefined : bloque.id.toString()
                  )}
                  title={bloque.horario}
                >
                  {bloque.id}
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
                  key={estado.id}
                  variant={filtros.estado === estado.id ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleFiltroRapido('estado', 
                    filtros.estado === estado.id ? undefined : estado.id
                  )}
                >
                  {estado.nombre}
                </Button>
              ))}
            </div>
          </div>

          {/* Edificios (Filtros avanzados) */}
          {filtrosAvanzadosAbiertos && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Edificios:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {edificios.map((edificio) => (
                  <Button
                    key={edificio}
                    variant={filtros.edificio === edificio ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => handleFiltroRapido('edificio', 
                      filtros.edificio === edificio ? undefined : edificio
                    )}
                  >
                    {edificio}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Indicadores de filtros activos */}
        {hayFiltrosActivos && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filtros.seccionId && (
              <Badge className="bg-blue-100 text-blue-800">
                Sección: {filtros.seccionId}
              </Badge>
            )}
            {filtros.docenteRut && (
              <Badge className="bg-green-100 text-green-800">
                Docente: {profesores.find(p => p.docente_rut === filtros.docenteRut)?.nombre || filtros.docenteRut}
              </Badge>
            )}
            {filtros.salaId && (
              <Badge className="bg-purple-100 text-purple-800">
                Sala: {filtros.salaId}
              </Badge>
            )}

            {filtros.dia && (
              <Badge className="bg-cyan-100 text-cyan-800">
                Día: {filtros.dia}
              </Badge>
            )}
            {filtros.estado && (
              <Badge className="bg-gray-100 text-gray-800">
                Estado: {estados.find(e => e.id === filtros.estado)?.nombre || filtros.estado}
              </Badge>
            )}
            {filtros.edificio && (
              <Badge className="bg-indigo-100 text-indigo-800">
                Edificio: {filtros.edificio}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
