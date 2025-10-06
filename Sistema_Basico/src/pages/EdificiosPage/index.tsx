import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Plus, Search, Building, MapPin, Users, Monitor, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

import type { Edificio, Sala, Campus } from "../../types";
import { campusMock, edificiosMock, salasMock, asignaturasMock } from "../../data/mock-data";


export function EdificiosPage() {
  const [campus, setCampus] = useState<Campus[]>(campusMock);
  const [edificios, setEdificios] = useState<Edificio[]>(edificiosMock);
  const [salas, setSalas] = useState<Sala[]>(salasMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [edificioSeleccionado, setEdificioSeleccionado] = useState<string>("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalSalaAbierto, setModalSalaAbierto] = useState(false);
  const [editandoEdificio, setEditandoEdificio] = useState<Edificio | null>(null);
  const [editandoSala, setEditandoSala] = useState<{ edificioId: number | string; sala: Sala | null }>({ edificioId: "", sala: null });

  const [formularioEdificio, setFormularioEdificio] = useState({
    nombre: "",
    tipo: "",
    campus_id: campus[0]?.id || 1
  });

  const [formularioSala, setFormularioSala] = useState({
    codigo: "",
    capacidad: "",
    tipo: "aula" as "aula" | "laboratorio" | "auditorio" | "sala_computacion",
    equipamiento: "",
    esta_disponible: true
  });


  // Obtener campus por id
  const getCampusNombre = (campus_id: number) => {
    const campusObj = campus.find(c => c.id === campus_id);
    return campusObj ? campusObj.nombre : "";
  };

  // Filtrar salas por edificio
  const getSalasPorEdificio = (edificioId: number) => {
    return salas.filter(sala => sala.edificio_id === edificioId);
  };

  // Obtener asignaturas asignadas a cada sala
  const getAsignaturasEnSala = (salaId: string) => {
    return asignaturasMock.filter(asig => asig.salaId === salaId);
  };

  const handleSubmitEdificio = () => {
    if (!formularioEdificio.nombre || !formularioEdificio.tipo) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }
    const nuevoId = editandoEdificio?.id ?? (edificios.length > 0 ? Math.max(...edificios.map(e => e.id)) + 1 : 1);
    const nuevoEdificio: Edificio = {
      id: nuevoId,
      nombre: formularioEdificio.nombre,
      tipo: formularioEdificio.tipo,
      campus_id: formularioEdificio.campus_id
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
    if (!formularioSala.codigo || !formularioSala.capacidad || !editandoSala.edificioId) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }
    const nuevoId = editandoSala.sala?.id ?? (salas.length > 0 ? Math.max(...salas.map(s => s.id)) + 1 : 1);
    const nuevaSala: Sala = {
      id: nuevoId,
      codigo: formularioSala.codigo,
      capacidad: parseInt(formularioSala.capacidad),
      tipo: formularioSala.tipo,
      esta_disponible: formularioSala.esta_disponible,
      edificio_id: Number(editandoSala.edificioId),
      equipamiento: formularioSala.equipamiento
    };
    if (editandoSala.sala) {
      setSalas(prev => prev.map(s => s.id === editandoSala.sala!.id ? nuevaSala : s));
      toast.success("Sala actualizada exitosamente");
    } else {
      setSalas(prev => [...prev, nuevaSala]);
      toast.success("Sala agregada exitosamente");
    }
    resetFormularioSala();
    setModalSalaAbierto(false);
  };

  const resetFormularioEdificio = () => {
    setFormularioEdificio({ nombre: "", tipo: "", campus_id: campus[0]?.id || 1 });
    setEditandoEdificio(null);
  };

  const resetFormularioSala = () => {
    setFormularioSala({
      codigo: "",
      capacidad: "",
      tipo: "aula",
      equipamiento: "",
      esta_disponible: true
    });
    setEditandoSala({ edificioId: "", sala: null });
  };

  const editarEdificio = (edificio: Edificio) => {
    setFormularioEdificio({
      nombre: edificio.nombre,
      tipo: edificio.tipo,
      campus_id: edificio.campus_id
    });
    setEditandoEdificio(edificio);
    setModalAbierto(true);
  };

  const editarSala = (edificioId: number, sala: Sala) => {
    setFormularioSala({
      codigo: sala.codigo,
      capacidad: sala.capacidad.toString(),
      tipo: sala.tipo as "aula" | "laboratorio" | "auditorio" | "sala_computacion",
      equipamiento: sala.equipamiento,
      esta_disponible: sala.esta_disponible
    });
    setEditandoSala({ edificioId, sala });
    setModalSalaAbierto(true);
  };

  const agregarSala = (edificioId: number) => {
    resetFormularioSala();
    setEditandoSala({ edificioId, sala: null });
    setModalSalaAbierto(true);
  };

  const eliminarEdificio = (id: number) => {
    setEdificios(prev => prev.filter(e => e.id !== id));
    setSalas(prev => prev.filter(s => s.edificio_id !== id)); // Eliminar salas asociadas
    toast.success("Edificio eliminado exitosamente");
  };

  const eliminarSala = (edificioId: number, salaId: number) => {
    setSalas(prev => prev.filter(s => s.id !== salaId));
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
                <Button variant="default" onClick={resetFormularioEdificio}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Edificio
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <span style={{color: '#000', fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '0.5px', WebkitTextStroke: '0.1px #000', textShadow: '0 0 1px #000', background: 'transparent', zIndex: 10}}>
                    {editandoEdificio ? "Editar Edificio" : "Agregar Nuevo Edificio"}
                  </span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" style={{color: '#000', fontWeight: 'bold', background: 'transparent', zIndex: 10}}>Nombre del Edificio *</Label>
                  <Input
                    id="nombre"
                    value={formularioEdificio.nombre}
                    onChange={(e) => setFormularioEdificio(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Edificio Biblioteca"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo" style={{color: '#000', fontWeight: 'bold', zIndex: 10}}>Tipo de Edificio *</Label>
                  <Input
                    id="tipo"
                    value={formularioEdificio.tipo}
                    onChange={(e) => setFormularioEdificio(prev => ({ ...prev, tipo: e.target.value }))}
                    placeholder="cientifico, ingenieria, administrativo, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus_id" style={{color: '#000', fontWeight: 'bold', zIndex: 10}}>Campus *</Label>
                  <Select
                    value={formularioEdificio.campus_id ? String(formularioEdificio.campus_id) : ""}
                    onValueChange={value => setFormularioEdificio(prev => ({ ...prev, campus_id: Number(value) }))}
                  >
                    <SelectTrigger
                      style={{ color: formularioEdificio.campus_id ? '#000' : undefined }}
                      className="dark:text-white"
                    >
                      <SelectValue placeholder="Selecciona un campus" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900">
                      {campus.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button className="!bg-gray-200 !text-black !hover:bg-gray-300 dark:!bg-gray-700 dark:!text-white dark:!hover:bg-gray-600" onClick={() => setModalAbierto(false)}>
                     Cancelar
                  </Button>
                 <Button className="!bg-blue-500 !text-white !hover:bg-blue-600" onClick={handleSubmitEdificio}>
                    {editandoEdificio ? "Actualizar" : "Agregar"} Edificio
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={modalSalaAbierto} onOpenChange={setModalSalaAbierto}>
            <DialogContent className="!bg-white !text-black">
              <DialogHeader>
                <DialogTitle>
                  {editandoSala.sala ? "Editar Sala" : "Agregar Nueva Sala"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edificio">Edificio *</Label>
                  <Select 
                    value={editandoSala.edificioId?.toString()} 
                    onValueChange={(value) => setEditandoSala(prev => ({ ...prev, edificioId: value }))}
                    disabled={!!editandoSala.sala}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un edificio" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900">
                      {edificios.map(edificio => (
                        <SelectItem key={edificio.id} value={edificio.id.toString()}>
                          {edificio.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código de Sala *</Label>
                    <Input
                      id="codigo"
                      value={formularioSala.codigo}
                      onChange={(e) => setFormularioSala(prev => ({ ...prev, codigo: e.target.value }))}
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
                    <SelectContent className="bg-white dark:bg-zinc-900">
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
                    checked={formularioSala.esta_disponible}
                    onChange={(e) => setFormularioSala(prev => ({ ...prev, esta_disponible: e.target.checked }))}
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
              <SelectContent className="bg-white dark:bg-zinc-900">
                <SelectItem value="todos">Todos los edificios</SelectItem>
                {edificios.map(edificio => (
                  <SelectItem key={edificio.id} value={edificio.id.toString()}>
                    {edificio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900">
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
        {edificios.map(edificio => {
          const salasEdificio = salas.filter(s => s.edificio_id === edificio.id);
          return (
            <Card key={edificio.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {edificio.nombre}
                        <Badge variant="outline">{edificio.tipo}</Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        Campus: {getCampusNombre(edificio.campus_id)}
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
                  {salasEdificio
                    .filter(sala => {
                      const coincideBusqueda = 
                        sala.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                        edificio.nombre.toLowerCase().includes(busqueda.toLowerCase());
                      const coincideTipo = filtroTipo === "todos" || sala.tipo === filtroTipo;
                      return coincideBusqueda && coincideTipo;
                    })
                    .map(sala => {
                      const asignaturasEnSala = getAsignaturasEnSala(sala.codigo);
                      return (
                        <Card key={sala.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{sala.codigo}</CardTitle>
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
                              <Badge variant={sala.esta_disponible ? "default" : "destructive"}>
                                {sala.esta_disponible ? "Disponible" : "No disponible"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>Capacidad: {sala.capacidad} Personas</span>
                            </div>
                            {sala.equipamiento && (
                              <div className="space-y-1">
                                <p className="text-sm">Equipamiento:</p>
                                <div className="flex flex-wrap gap-1">
                                  {sala.equipamiento.split(',').map((equipo, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {equipo.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {asignaturasEnSala.length > 0 && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <p className="text-sm">Asignaturas Programadas:</p>
                                </div>
                                <div className="space-y-1">
                                  {asignaturasEnSala.map(asignatura => (
                                    <div key={asignatura.id} className="text-xs p-2 rounded" style={{ backgroundColor: "#e4e4e7" }}>
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
                {salasEdificio.length === 0 && (
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
          );
        })}
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
