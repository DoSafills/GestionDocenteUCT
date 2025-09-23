import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Plus, Search, Building, MapPin, Users, Monitor, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { Edificio, Sala } from "../../types";
import { edificiosMock, asignaturasMock } from "../../data/mock-data";

export function SalasPage() {
  const [edificios, setEdificios] = useState<Edificio[]>(edificiosMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [edificioSeleccionado, setEdificioSeleccionado] = useState<string>("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalSalaAbierto, setModalSalaAbierto] = useState(false);
  const [editandoEdificio, setEditandoEdificio] = useState<Edificio | null>(null);
  const [editandoSala, setEditandoSala] = useState<{ edificioId: string; sala: Sala | null }>({ edificioId: "", sala: null });

  const [formularioEdificio, setFormularioEdificio] = useState({
    nombre: "",
    codigo: "",
    direccion: ""
  });

  const [formularioSala, setFormularioSala] = useState({
    numero: "",
    capacidad: "",
    tipo: "aula" as "aula" | "laboratorio" | "auditorio" | "sala_computacion",
    equipamiento: "",
    disponible: true
  });

  // Obtener todas las salas de todos los edificios
  const todasLasSalas = edificios.flatMap(edificio => 
    edificio.salas.map(sala => ({ ...sala, edificio }))
  );

  const salasFiltradas = todasLasSalas.filter(sala => {
    const coincideBusqueda = 
      sala.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      sala.edificio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      sala.edificio.codigo.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideTipo = filtroTipo === "todos" || sala.tipo === filtroTipo;
    const coincideEdificio = edificioSeleccionado === "todos" || sala.edificioId === edificioSeleccionado;
    
    return coincideBusqueda && coincideTipo && coincideEdificio;
  });

  // Obtener asignaturas asignadas a cada sala
  const getAsignaturasEnSala = (salaId: string) => {
    return asignaturasMock.filter(asig => asig.salaId === salaId);
  };

  const handleSubmitEdificio = () => {
    if (!formularioEdificio.nombre || !formularioEdificio.codigo) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const nuevoEdificio: Edificio = {
      id: editandoEdificio?.id || `edif_${Date.now()}`,
      nombre: formularioEdificio.nombre,
      codigo: formularioEdificio.codigo,
      direccion: formularioEdificio.direccion,
      salas: editandoEdificio?.salas || []
    };

    if (editandoEdificio) {
      setEdificios(prev => prev.map(e => e.id === editandoEdificio.id ? nuevoEdificio : e));
      toast.success("Edificio actualizado exitosamente");
    } else {
      setEdificios(prev => [...prev, nuevoEdificio]);
      toast.success("Edificio agregado exitosamente");
    }

    resetFormularioEdificio();
    setModalAbierto(false);
  };

  const handleSubmitSala = () => {
    if (!formularioSala.numero || !formularioSala.capacidad) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const nuevaSala: Sala = {
      id: editandoSala.sala?.id || `sala_${Date.now()}`,
      numero: formularioSala.numero,
      edificioId: editandoSala.edificioId,
      capacidad: parseInt(formularioSala.capacidad),
      tipo: formularioSala.tipo,
      equipamiento: formularioSala.equipamiento.split(",").map(e => e.trim()).filter(e => e),
      disponible: formularioSala.disponible,
      horarios: editandoSala.sala?.horarios || []
    };

    setEdificios(prev => prev.map(edificio => {
      if (edificio.id === editandoSala.edificioId) {
        if (editandoSala.sala) {
          // Editando sala existente
          return {
            ...edificio,
            salas: edificio.salas.map(s => s.id === editandoSala.sala!.id ? nuevaSala : s)
          };
        } else {
          // Agregando nueva sala
          return {
            ...edificio,
            salas: [...edificio.salas, nuevaSala]
          };
        }
      }
      return edificio;
    }));

    toast.success(editandoSala.sala ? "Sala actualizada exitosamente" : "Sala agregada exitosamente");
    resetFormularioSala();
    setModalSalaAbierto(false);
  };

  const resetFormularioEdificio = () => {
    setFormularioEdificio({ nombre: "", codigo: "", direccion: "" });
    setEditandoEdificio(null);
  };

  const resetFormularioSala = () => {
    setFormularioSala({
      numero: "",
      capacidad: "",
      tipo: "aula",
      equipamiento: "",
      disponible: true
    });
    setEditandoSala({ edificioId: "", sala: null });
  };

  const editarEdificio = (edificio: Edificio) => {
    setFormularioEdificio({
      nombre: edificio.nombre,
      codigo: edificio.codigo,
      direccion: edificio.direccion
    });
    setEditandoEdificio(edificio);
    setModalAbierto(true);
  };

  const editarSala = (edificioId: string, sala: Sala) => {
    setFormularioSala({
      numero: sala.numero,
      capacidad: sala.capacidad.toString(),
      tipo: sala.tipo,
      equipamiento: sala.equipamiento.join(", "),
      disponible: sala.disponible
    });
    setEditandoSala({ edificioId, sala });
    setModalSalaAbierto(true);
  };

  const agregarSala = (edificioId: string) => {
    resetFormularioSala();
    setEditandoSala({ edificioId, sala: null });
    setModalSalaAbierto(true);
  };

  const eliminarEdificio = (id: string) => {
    setEdificios(prev => prev.filter(e => e.id !== id));
    toast.success("Edificio eliminado exitosamente");
  };

  const eliminarSala = (edificioId: string, salaId: string) => {
    setEdificios(prev => prev.map(edificio => {
      if (edificio.id === edificioId) {
        return {
          ...edificio,
          salas: edificio.salas.filter(s => s.id !== salaId)
        };
      }
      return edificio;
    }));
    toast.success("Sala eliminada exitosamente");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">Gestión de Salas y Edificios</h2>
          <p className="text-muted-foreground">
            Administra la infraestructura y asignación de espacios físicos
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
            <DialogTrigger asChild>
              <div>
                <Button variant="outline" onClick={resetFormularioEdificio}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Edificio
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editandoEdificio ? "Editar Edificio" : "Agregar Nuevo Edificio"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Edificio *</Label>
                  <Input
                    id="nombre"
                    value={formularioEdificio.nombre}
                    onChange={(e) => setFormularioEdificio(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Edificio de Ciencias"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formularioEdificio.codigo}
                    onChange={(e) => setFormularioEdificio(prev => ({ ...prev, codigo: e.target.value }))}
                    placeholder="CS"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formularioEdificio.direccion}
                    onChange={(e) => setFormularioEdificio(prev => ({ ...prev, direccion: e.target.value }))}
                    placeholder="Av. Universidad 123"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setModalAbierto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmitEdificio}>
                    {editandoEdificio ? "Actualizar" : "Agregar"} Edificio
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={modalSalaAbierto} onOpenChange={setModalSalaAbierto}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editandoSala.sala ? "Editar Sala" : "Agregar Nueva Sala"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edificio">Edificio *</Label>
                  <Select 
                    value={editandoSala.edificioId} 
                    onValueChange={(value) => setEditandoSala(prev => ({ ...prev, edificioId: value }))}
                    disabled={!!editandoSala.sala}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un edificio" />
                    </SelectTrigger>
                    <SelectContent>
                      {edificios.map(edificio => (
                        <SelectItem key={edificio.id} value={edificio.id}>
                          {edificio.nombre} ({edificio.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número de Sala *</Label>
                    <Input
                      id="numero"
                      value={formularioSala.numero}
                      onChange={(e) => setFormularioSala(prev => ({ ...prev, numero: e.target.value }))}
                      placeholder="CS-101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad *</Label>
                    <Input
                      id="capacidad"
                      type="number"
                      value={formularioSala.capacidad}
                      onChange={(e) => setFormularioSala(prev => ({ ...prev, capacidad: e.target.value }))}
                      placeholder="40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Sala</Label>
                  <Select 
                    value={formularioSala.tipo} 
                    onValueChange={(value: any) => setFormularioSala(prev => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aula">Aula</SelectItem>
                      <SelectItem value="laboratorio">Laboratorio</SelectItem>
                      <SelectItem value="auditorio">Auditorio</SelectItem>
                      <SelectItem value="sala_computacion">Sala de Computación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipamiento">Equipamiento (separado por comas)</Label>
                  <Textarea
                    id="equipamiento"
                    value={formularioSala.equipamiento}
                    onChange={(e) => setFormularioSala(prev => ({ ...prev, equipamiento: e.target.value }))}
                    placeholder="Proyector, Pizarra, Sistema de audio"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="disponible"
                    checked={formularioSala.disponible}
                    onChange={(e) => setFormularioSala(prev => ({ ...prev, disponible: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="disponible">Disponible para uso</Label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setModalSalaAbierto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmitSala}>
                    {editandoSala.sala ? "Actualizar" : "Agregar"} Sala
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por sala, edificio o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={edificioSeleccionado} onValueChange={setEdificioSeleccionado}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por edificio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los edificios</SelectItem>
                {edificios.map(edificio => (
                  <SelectItem key={edificio.id} value={edificio.id}>
                    {edificio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="aula">Aula</SelectItem>
                <SelectItem value="laboratorio">Laboratorio</SelectItem>
                <SelectItem value="auditorio">Auditorio</SelectItem>
                <SelectItem value="sala_computacion">Sala de Computación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vista por edificios */}
      <div className="space-y-6">
        {edificios.map(edificio => (
          <Card key={edificio.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {edificio.nombre}
                      <Badge variant="outline">{edificio.codigo}</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {edificio.direccion || 'Dirección no especificada'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => agregarSala(edificio.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Sala
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editarEdificio(edificio)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarEdificio(edificio.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {edificio.salas
                  .filter(sala => {
                    const coincideBusqueda = 
                      sala.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
                      edificio.nombre.toLowerCase().includes(busqueda.toLowerCase());
                    const coincideTipo = filtroTipo === "todos" || sala.tipo === filtroTipo;
                    return coincideBusqueda && coincideTipo;
                  })
                  .map(sala => {
                    const asignaturasEnSala = getAsignaturasEnSala(sala.id);
                    
                    return (
                      <Card key={sala.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{sala.numero}</CardTitle>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editarSala(edificio.id, sala)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => eliminarSala(edificio.id, sala.id)}
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{sala.tipo}</Badge>
                            <Badge variant={sala.disponible ? "default" : "destructive"}>
                              {sala.disponible ? "Disponible" : "No disponible"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>Capacidad: {sala.capacidad} personas</span>
                          </div>
                          
                          {sala.equipamiento.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-sm">Equipamiento:</p>
                              <div className="flex flex-wrap gap-1">
                                {sala.equipamiento.map((equipo, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {equipo}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {asignaturasEnSala.length > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm">Asignaturas programadas:</p>
                              </div>
                              <div className="space-y-1">
                                {asignaturasEnSala.map(asignatura => (
                                  <div key={asignatura.id} className="text-xs p-2 bg-muted rounded">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{asignatura.codigo}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {asignatura.estado}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{asignatura.nombre}</p>
                                    <p className="text-muted-foreground">
                                      {asignatura.horarios.map(h => 
                                        `${h.dia} ${h.horaInicio}-${h.horaFin}`
                                      ).join(', ')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
              
              {edificio.salas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Monitor className="w-8 h-8 mx-auto mb-2" />
                  <p>No hay salas en este edificio</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => agregarSala(edificio.id)}
                  >
                    Agregar primera sala
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {edificios.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">No hay edificios registrados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza agregando tu primer edificio para gestionar las salas
            </p>
            <Button onClick={resetFormularioEdificio}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Edificio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}