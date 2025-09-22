import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Plus, Search, Mail, Phone, Calendar, Edit, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import type { Profesor } from "../../types";
import { profesoresMock } from "../../data/mock-data";

export function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>(profesoresMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [profesorEditando, setProfesorEditando] = useState<Profesor | null>(null);
  
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    especialidad: "",
    diasDisponibles: [] as string[],
    horasInicio: "",
    horasFin: "",
    experiencia: "",
    estado: "activo" as "activo" | "inactivo"
  });

  const profesoresFiltrados = profesores.filter(profesor => {
    const coincideBusqueda = 
      profesor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      profesor.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      profesor.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      profesor.especialidad.some(esp => esp.toLowerCase().includes(busqueda.toLowerCase()));
    
    const coincideEstado = filtroEstado === "todos" || profesor.estado === filtroEstado;
    
    return coincideBusqueda && coincideEstado;
  });

  const handleSubmit = () => {
    if (!formulario.nombre || !formulario.apellido || !formulario.email) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const nuevoProfesor: Profesor = {
      id: profesorEditando?.id || `prof_${Date.now()}`,
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      email: formulario.email,
      telefono: formulario.telefono,
      especialidad: formulario.especialidad.split(",").map(s => s.trim()),
      disponibilidad: {
        dias: formulario.diasDisponibles,
        horasInicio: formulario.horasInicio,
        horasFin: formulario.horasFin
      },
      experiencia: parseInt(formulario.experiencia) || 0,
      estado: formulario.estado,
      fechaContratacion: profesorEditando?.fechaContratacion || new Date().toISOString().split('T')[0]
    };

    if (profesorEditando) {
      setProfesores(prev => prev.map(p => p.id === profesorEditando.id ? nuevoProfesor : p));
      toast.success("Profesor actualizado exitosamente");
    } else {
      setProfesores(prev => [...prev, nuevoProfesor]);
      toast.success("Profesor agregado exitosamente");
    }

    resetFormulario();
    setModalAbierto(false);
  };

  const resetFormulario = () => {
    setFormulario({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      especialidad: "",
      diasDisponibles: [],
      horasInicio: "",
      horasFin: "",
      experiencia: "",
      estado: "activo"
    });
    setProfesorEditando(null);
  };

  const editarProfesor = (profesor: Profesor) => {
    setFormulario({
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      email: profesor.email,
      telefono: profesor.telefono,
      especialidad: profesor.especialidad.join(", "),
      diasDisponibles: profesor.disponibilidad.dias,
      horasInicio: profesor.disponibilidad.horasInicio,
      horasFin: profesor.disponibilidad.horasFin,
      experiencia: profesor.experiencia.toString(),
      estado: profesor.estado
    });
    setProfesorEditando(profesor);
    setModalAbierto(true);
  };

  const eliminarProfesor = (id: string) => {
    setProfesores(prev => prev.filter(p => p.id !== id));
    toast.success("Profesor eliminado exitosamente");
  };

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">Gestión de Profesores</h2>
          <p className="text-muted-foreground">
            Administra la información y disponibilidad del personal docente
          </p>
        </div>
        
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogTrigger asChild>
            <div>
              <Button onClick={resetFormulario}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Profesor
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {profesorEditando ? "Editar Profesor" : "Agregar Nuevo Profesor"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formulario.nombre}
                    onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre del profesor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={formulario.apellido}
                    onChange={(e) => setFormulario(prev => ({ ...prev, apellido: e.target.value }))}
                    placeholder="Apellido del profesor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formulario.email}
                    onChange={(e) => setFormulario(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@universidad.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formulario.telefono}
                    onChange={(e) => setFormulario(prev => ({ ...prev, telefono: e.target.value }))}
                    placeholder="+56912345678"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidades (separadas por coma)</Label>
                <Textarea
                  id="especialidad"
                  value={formulario.especialidad}
                  onChange={(e) => setFormulario(prev => ({ ...prev, especialidad: e.target.value }))}
                  placeholder="Matemáticas, Álgebra, Estadística"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Días disponibles</Label>
                <div className="grid grid-cols-3 gap-2">
                  {diasSemana.map(dia => (
                    <label key={dia} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formulario.diasDisponibles.includes(dia)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormulario(prev => ({
                              ...prev,
                              diasDisponibles: [...prev.diasDisponibles, dia]
                            }));
                          } else {
                            setFormulario(prev => ({
                              ...prev,
                              diasDisponibles: prev.diasDisponibles.filter(d => d !== dia)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{dia}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horasInicio">Hora inicio</Label>
                  <Input
                    id="horasInicio"
                    type="time"
                    value={formulario.horasInicio}
                    onChange={(e) => setFormulario(prev => ({ ...prev, horasInicio: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horasFin">Hora fin</Label>
                  <Input
                    id="horasFin"
                    type="time"
                    value={formulario.horasFin}
                    onChange={(e) => setFormulario(prev => ({ ...prev, horasFin: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experiencia">Años experiencia</Label>
                  <Input
                    id="experiencia"
                    type="number"
                    value={formulario.experiencia}
                    onChange={(e) => setFormulario(prev => ({ ...prev, experiencia: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formulario.estado} onValueChange={(value: "activo" | "inactivo") => 
                  setFormulario(prev => ({ ...prev, estado: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {profesorEditando ? "Actualizar" : "Agregar"} Profesor
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, email o especialidad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de profesores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profesoresFiltrados.map((profesor) => (
          <Card key={profesor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {profesor.nombre} {profesor.apellido}
                    </CardTitle>
                    <Badge variant={profesor.estado === 'activo' ? 'secondary' : 'outline'}>
                      {profesor.estado}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editarProfesor(profesor)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarProfesor(profesor.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{profesor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{profesor.telefono || 'No especificado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{profesor.experiencia} años de experiencia</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {profesor.especialidad.map((esp, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {esp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">Disponibilidad:</p>
                <div className="text-xs text-muted-foreground">
                  <p>Días: {profesor.disponibilidad.dias.join(', ')}</p>
                  <p>Horario: {profesor.disponibilidad.horasInicio} - {profesor.disponibilidad.horasFin}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {profesoresFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">No se encontraron profesores</h3>
            <p className="text-muted-foreground">
              {busqueda || filtroEstado !== "todos" 
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primer profesor"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}