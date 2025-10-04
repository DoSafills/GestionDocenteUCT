import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Plus, Search, BookOpen, User, MapPin, Calendar, Edit, Trash2, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import type { Asignatura } from "../../types";
import { asignaturasMock, profesoresMock, edificiosMock } from "../../data/mock-data";

export function AsignaturasPage() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>(asignaturasMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroCarrera, setFiltroCarrera] = useState<string>("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoAsignatura, setEditandoAsignatura] = useState<Asignatura | null>(null);

  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    creditos: "",
    semestre: "",
    carrera: "",
    profesorId: "",
    salaId: "",
    cupos: "",
    descripcion: "",
    estado: "planificada" as "planificada" | "programada" | "en_curso" | "finalizada",
    horarios: [{ dia: "", horaInicio: "", horaFin: "" }],
    prerrequisitos: ""
  });

  // Obtener todas las salas de todos los edificios
  const todasLasSalas = edificiosMock.flatMap(edificio => 
    edificio.salas.map(sala => ({ ...sala, edificio }))
  );

  // Obtener carreras únicas
  const carreras = [...new Set(asignaturas.map(a => a.carrera))];

  const asignaturasFiltradas = asignaturas.filter(asignatura => {
    const coincideBusqueda = 
      asignatura.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      asignatura.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      asignatura.carrera.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideEstado = filtroEstado === "todos" || asignatura.estado === filtroEstado;
    const coincideCarrera = filtroCarrera === "todos" || asignatura.carrera === filtroCarrera;
    
    return coincideBusqueda && coincideEstado && coincideCarrera;
  });

  const handleSubmit = () => {
    if (!formulario.codigo || !formulario.nombre || !formulario.carrera) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const nuevaAsignatura: Asignatura = {
      id: editandoAsignatura?.id || `asig_${Date.now()}`,
      codigo: formulario.codigo,
      nombre: formulario.nombre,
      creditos: parseInt(formulario.creditos) || 0,
      semestre: parseInt(formulario.semestre) || 1,
      carrera: formulario.carrera,
      profesorId: formulario.profesorId || undefined,
      salaId: formulario.salaId || undefined,
      horarios: formulario.horarios.filter(h => h.dia && h.horaInicio && h.horaFin),
      prerrequisitos: formulario.prerrequisitos ? 
        formulario.prerrequisitos.split(",").map(p => p.trim()) : [],
      cupos: parseInt(formulario.cupos) || 0,
      inscritos: editandoAsignatura?.inscritos || 0,
      estado: formulario.estado,
      descripcion: formulario.descripcion
    };

    if (editandoAsignatura) {
      setAsignaturas(prev => prev.map(a => a.id === editandoAsignatura.id ? nuevaAsignatura : a));
      toast.success("Asignatura actualizada exitosamente");
    } else {
      setAsignaturas(prev => [...prev, nuevaAsignatura]);
      toast.success("Asignatura agregada exitosamente");
    }

    resetFormulario();
    setModalAbierto(false);
  };

  const resetFormulario = () => {
    setFormulario({
      codigo: "",
      nombre: "",
      creditos: "",
      semestre: "",
      carrera: "",
      profesorId: "",
      salaId: "",
      cupos: "",
      descripcion: "",
      estado: "planificada",
      horarios: [{ dia: "", horaInicio: "", horaFin: "" }],
      prerrequisitos: ""
    });
    setEditandoAsignatura(null);
  };

  const editarAsignatura = (asignatura: Asignatura) => {
    setFormulario({
      codigo: asignatura.codigo,
      nombre: asignatura.nombre,
      creditos: asignatura.creditos.toString(),
      semestre: asignatura.semestre.toString(),
      carrera: asignatura.carrera,
      profesorId: asignatura.profesorId || "",
      salaId: asignatura.salaId || "",
      cupos: asignatura.cupos.toString(),
      descripcion: asignatura.descripcion,
      estado: asignatura.estado,
      horarios: asignatura.horarios.length > 0 ? asignatura.horarios : [{ dia: "", horaInicio: "", horaFin: "" }],
      prerrequisitos: asignatura.prerrequisitos.join(", ")
    });
    setEditandoAsignatura(asignatura);
    setModalAbierto(true);
  };

  const eliminarAsignatura = (id: string) => {
    setAsignaturas(prev => prev.filter(a => a.id !== id));
    toast.success("Asignatura eliminada exitosamente");
  };

  const agregarHorario = () => {
    setFormulario(prev => ({
      ...prev,
      horarios: [...prev.horarios, { dia: "", horaInicio: "", horaFin: "" }]
    }));
  };

  const eliminarHorario = (index: number) => {
    setFormulario(prev => ({
      ...prev,
      horarios: prev.horarios.filter((_, i) => i !== index)
    }));
  };

  const actualizarHorario = (index: number, campo: string, valor: string) => {
    setFormulario(prev => ({
      ...prev,
      horarios: prev.horarios.map((h, i) => 
        i === index ? { ...h, [campo]: valor } : h
      )
    }));
  };

  const getProfesorNombre = (profesorId?: string) => {
    const profesor = profesoresMock.find(p => p.id === profesorId);
    return profesor ? `${profesor.nombre} ${profesor.apellido}` : "Sin asignar";
  };

  const getSalaNombre = (salaId?: string) => {
    const sala = todasLasSalas.find(s => s.id === salaId);
    return sala ? `${sala.numero} (${sala.edificio.codigo})` : "Sin asignar";
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'planificada': return 'bg-gray-100 text-gray-800';
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'en_curso': return 'bg-green-100 text-green-800';
      case 'finalizada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">Gestión de Asignaturas</h2>
          <p className="text-muted-foreground">
            Administra el catálogo de asignaturas, horarios y asignaciones
          </p>
        </div>
        
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogTrigger asChild>
            <div>
              <Button onClick={resetFormulario}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Asignatura
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editandoAsignatura ? "Editar Asignatura" : "Agregar Nueva Asignatura"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h4>Información Básica</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código de Asignatura *</Label>
                    <Input
                      id="codigo"
                      value={formulario.codigo}
                      onChange={(e) => setFormulario(prev => ({ ...prev, codigo: e.target.value }))}
                      placeholder="MAT1105-07"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formulario.nombre}
                      onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Cálculo I"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creditos">Créditos</Label>
                    <Input
                      id="creditos"
                      type="number"
                      value={formulario.creditos}
                      onChange={(e) => setFormulario(prev => ({ ...prev, creditos: e.target.value }))}
                      placeholder="6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semestre">Semestre</Label>
                    <Input
                      id="semestre"
                      type="number"
                      value={formulario.semestre}
                      onChange={(e) => setFormulario(prev => ({ ...prev, semestre: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cupos">Cupos</Label>
                    <Input
                      id="cupos"
                      type="number"
                      value={formulario.cupos}
                      onChange={(e) => setFormulario(prev => ({ ...prev, cupos: e.target.value }))}
                      placeholder="40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formulario.estado} onValueChange={(value: any) => 
                      setFormulario(prev => ({ ...prev, estado: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-900">
                        <SelectItem value="planificada">Planificada</SelectItem>
                        <SelectItem value="programada">Programada</SelectItem>
                        <SelectItem value="en_curso">En Curso</SelectItem>
                        <SelectItem value="finalizada">Finalizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carrera">Carrera *</Label>
                  <Input
                    id="carrera"
                    value={formulario.carrera}
                    onChange={(e) => setFormulario(prev => ({ ...prev, carrera: e.target.value }))}
                    placeholder="Ingeniería Civil"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formulario.descripcion}
                    onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción de la asignatura..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerrequisitos">Prerrequisitos (códigos separados por coma)</Label>
                  <Input
                    id="prerrequisitos"
                    value={formulario.prerrequisitos}
                    onChange={(e) => setFormulario(prev => ({ ...prev, prerrequisitos: e.target.value }))}
                    placeholder="MAT1105-06, FIS1201-01"
                  />
                </div>
              </div>

              {/* Asignaciones */}
              <div className="space-y-4">
                <h4>Asignaciones</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profesor">Profesor</Label>
                    <Select value={formulario.profesorId} onValueChange={(value) => 
                      setFormulario(prev => ({ ...prev, profesorId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar profesor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-900">
                        <SelectItem value="">Sin asignar</SelectItem>
                        {profesoresMock.filter(p => p.estado === 'activo').map(profesor => (
                          <SelectItem key={profesor.id} value={profesor.id}>
                            {profesor.nombre} {profesor.apellido} - {profesor.especialidad.join(', ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sala">Sala</Label>
                    <Select value={formulario.salaId} onValueChange={(value) => 
                      setFormulario(prev => ({ ...prev, salaId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sala" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-900">
                        <SelectItem value="">Sin asignar</SelectItem>
                        {todasLasSalas.filter(s => s.disponible).map(sala => (
                          <SelectItem key={sala.id} value={sala.id}>
                            {sala.numero} - {sala.edificio.nombre} (Cap: {sala.capacidad})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4>Horarios</h4>
                  <Button variant="outline" size="sm" onClick={agregarHorario}>
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Horario
                  </Button>
                </div>
                {formulario.horarios.map((horario, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Día</Label>
                      <Select 
                        value={horario.dia} 
                        onValueChange={(value) => actualizarHorario(index, 'dia', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar día" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-900">
                          {diasSemana.map(dia => (
                            <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Hora Inicio</Label>
                      <Input
                        type="time"
                        value={horario.horaInicio}
                        onChange={(e) => actualizarHorario(index, 'horaInicio', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hora Fin</Label>
                      <Input
                        type="time"
                        value={horario.horaFin}
                        onChange={(e) => actualizarHorario(index, 'horaFin', e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarHorario(index)}
                        disabled={formulario.horarios.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editandoAsignatura ? "Actualizar" : "Agregar"} Asignatura
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por código, nombre o carrera..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroCarrera} onValueChange={setFiltroCarrera}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por carrera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las carreras</SelectItem>
                {carreras.map(carrera => (
                  <SelectItem key={carrera} value={carrera}>{carrera}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="planificada">Planificada</SelectItem>
                <SelectItem value="programada">Programada</SelectItem>
                <SelectItem value="en_curso">En Curso</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de asignaturas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {asignaturasFiltradas.map((asignatura) => (
          <Card key={asignatura.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {asignatura.codigo}
                  </CardTitle>
                  <h4 className="text-lg">{asignatura.nombre}</h4>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getEstadoColor(asignatura.estado)}>
                      {asignatura.estado.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {asignatura.creditos} créditos
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editarAsignatura(asignatura)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarAsignatura(asignatura.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Carrera:</strong> {asignatura.carrera}</p>
                  <p><strong>Semestre:</strong> {asignatura.semestre}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{asignatura.inscritos}/{asignatura.cupos} estudiantes</span>
                  </div>
                </div>
              </div>

              {asignatura.descripcion && (
                <div>
                  <p className="text-sm text-muted-foreground">{asignatura.descripcion}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span><strong>Profesor:</strong> {getProfesorNombre(asignatura.profesorId)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span><strong>Sala:</strong> {getSalaNombre(asignatura.salaId)}</span>
                </div>
              </div>

              {asignatura.horarios.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Horarios:</strong></span>
                  </div>
                  <div className="space-y-1">
                    {asignatura.horarios.map((horario, index) => (
                      <div key={index} className="text-sm bg-muted p-2 rounded">
                        {horario.dia} de {horario.horaInicio} a {horario.horaFin}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {asignatura.prerrequisitos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm"><strong>Prerrequisitos:</strong></p>
                  <div className="flex flex-wrap gap-1">
                    {asignatura.prerrequisitos.map((prereq, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {asignaturasFiltradas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">No se encontraron asignaturas</h3>
            <p className="text-muted-foreground">
              {busqueda || filtroEstado !== "todos" || filtroCarrera !== "todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primera asignatura"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}