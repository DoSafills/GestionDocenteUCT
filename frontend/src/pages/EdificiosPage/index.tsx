import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Plus, Search, Building, MapPin, Users, Monitor, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { campusService } from "@/infraestructure/services/campus/CampusService";
import { edificioService } from "@/infraestructure/services/edificio/EdificioService";
import { salaService } from "@/infraestructure/services/sala/SalaService";

import type { CampusDTO } from "@/domain/campus/types";
import type { EdificioDTO, EdificioCreateDTO } from "@/domain/edificios/types";
import type { SalaDTO, SalaCreateDTO } from "@/domain/salas/types";

// Tipos válidos para Sala según backend
type SalaTipo = "aula" | "laboratorio" | "auditorio" | "taller" | "sala_conferencias";

export function EdificiosPage() {
  // Estados con DTOs (más simples para render)
  const [campus, setCampus] = useState<CampusDTO[]>([]);
  const [edificios, setEdificios] = useState<EdificioDTO[]>([]);
  const [salas, setSalas] = useState<SalaDTO[]>([]);

  const [loading, setLoading] = useState(true);

  // Filtros/estado UI
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [edificioSeleccionado, setEdificioSeleccionado] = useState<string>("todos");

  // Modales
  const [modalEdificioAbierto, setModalEdificioAbierto] = useState(false);
  const [modalSalaAbierto, setModalSalaAbierto] = useState(false);

  // Edición
  const [editandoEdificio, setEditandoEdificio] = useState<EdificioDTO | null>(null);
  const [editandoSala, setEditandoSala] = useState<{ edificioId: number | ""; sala: SalaDTO | null }>({ edificioId: "", sala: null });

  // Formularios
  const [formularioEdificio, setFormularioEdificio] = useState<{
    nombre: string;
    pisos: string; // string para Input; se convierte a number al enviar
    campus_id: number | "";
  }>({
    nombre: "",
    pisos: "",
    campus_id: "",
  });

  const [formularioSala, setFormularioSala] = useState<{
    codigo: string;
    capacidad: string; // string para Input
    tipo: SalaTipo;
    equipamiento: string;
    disponible: boolean;
  }>({
    codigo: "",
    capacidad: "",
    tipo: "aula",
    equipamiento: "",
    disponible: true,
  });

  // ---------- Carga inicial ----------
  useEffect(() => {
    (async () => {
      try {
        const [campusList, edificiosList, salasList] = await Promise.all([
          campusService.obtenerTodas(),
          edificioService.obtenerTodas(),
          // Traer muchas salas (paginación simple)
          salaService.buscar(0, 1000),
        ]);
        setCampus(campusList.map(c => c.toDTO()));
        setEdificios(edificiosList.map(e => e.toDTO()));
        setSalas(salasList.map(s => s.toDTO()));
      } catch (e: any) {
        toast.error(e?.message ?? "No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------- Helpers ----------
  const getCampusNombre = (campus_id: number) => {
    const c = campus.find(x => x.id === campus_id);
    return c ? c.nombre : "";
  };

  const getSalasPorEdificio = (edificioId: number) => salas.filter(s => s.edificio_id === edificioId);

  // ---------- Edificio: crear/editar ----------
  const resetFormularioEdificio = () => {
    setFormularioEdificio({
      nombre: "",
      pisos: "",
      campus_id: campus.length ? campus[0].id : "",
    });
    setEditandoEdificio(null);
  };

  const abrirModalCrearEdificio = () => {
    resetFormularioEdificio();
    setModalEdificioAbierto(true);
  };

  const editarEdificioClick = (edificio: EdificioDTO) => {
    setFormularioEdificio({
      nombre: edificio.nombre,
      pisos: edificio.pisos != null ? String(edificio.pisos) : "",
      campus_id: edificio.campus_id,
    });
    setEditandoEdificio(edificio);
    setModalEdificioAbierto(true);
  };

  const handleSubmitEdificio = async () => {
    if (!formularioEdificio.nombre || !formularioEdificio.campus_id) {
      toast.error("Por favor completa los campos obligatorios (nombre y campus).");
      return;
    }

    const payload: EdificioCreateDTO = {
      nombre: formularioEdificio.nombre.trim(),
      campus_id: Number(formularioEdificio.campus_id),
      pisos: formularioEdificio.pisos ? Number(formularioEdificio.pisos) : undefined,
    };

    try {
      if (editandoEdificio) {
        const updated = await edificioService.actualizar(editandoEdificio.id, payload);
        const dto = updated.toDTO();
        setEdificios(prev => prev.map(e => (e.id === dto.id ? dto : e)));
        toast.success("Edificio actualizado exitosamente");
      } else {
        const created = await edificioService.crearNueva(payload);
        const dto = created.toDTO();
        setEdificios(prev => [...prev, dto]);
        toast.success("Edificio agregado exitosamente");
      }
      resetFormularioEdificio();
      setModalEdificioAbierto(false);
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo guardar el edificio.");
    }
  };

  const eliminarEdificio = async (id: number) => {
    try {
      await edificioService.eliminar(id);
      setEdificios(prev => prev.filter(e => e.id !== id));
      setSalas(prev => prev.filter(s => s.edificio_id !== id)); // Limpia salas asociadas en UI
      toast.success("Edificio eliminado exitosamente");
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo eliminar el edificio.");
    }
  };

  // ---------- Sala: crear/editar ----------
  const resetFormularioSala = () => {
    setFormularioSala({
      codigo: "",
      capacidad: "",
      tipo: "aula",
      equipamiento: "",
      disponible: true,
    });
    setEditandoSala({ edificioId: "", sala: null });
  };

  const agregarSala = (edificioId: number) => {
    resetFormularioSala();
    setEditandoSala({ edificioId, sala: null });
    setModalSalaAbierto(true);
  };

  const editarSalaClick = (edificioId: number, sala: SalaDTO) => {
    setFormularioSala({
      codigo: sala.codigo,
      capacidad: String(sala.capacidad),
      tipo: sala.tipo as SalaTipo,
      equipamiento: sala.equipamiento ?? "",
      disponible: !!sala.disponible,
    });
    setEditandoSala({ edificioId, sala });
    setModalSalaAbierto(true);
  };

  const handleSubmitSala = async () => {
    if (!formularioSala.codigo || !formularioSala.capacidad || !editandoSala.edificioId) {
      toast.error("Por favor completa código, capacidad y edificio.");
      return;
    }

    const payload: SalaCreateDTO = {
      codigo: formularioSala.codigo.trim().toUpperCase(),
      capacidad: Number(formularioSala.capacidad),
      tipo: formularioSala.tipo,
      disponible: formularioSala.disponible,
      equipamiento: formularioSala.equipamiento?.trim() || undefined,
      edificio_id: Number(editandoSala.edificioId),
    };

    try {
      if (editandoSala.sala) {
        const updated = await salaService.actualizar(editandoSala.sala.id, payload);
        const dto = updated.toDTO();
        setSalas(prev => prev.map(s => (s.id === dto.id ? dto : s)));
        toast.success("Sala actualizada exitosamente");
      } else {
        const created = await salaService.crearNueva(payload);
        const dto = created.toDTO();
        setSalas(prev => [...prev, dto]);
        toast.success("Sala agregada exitosamente");
      }
      resetFormularioSala();
      setModalSalaAbierto(false);
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo guardar la sala.");
    }
  };

  const eliminarSala = async (_edificioId: number, salaId: number) => {
    try {
      await salaService.eliminar(salaId);
      setSalas(prev => prev.filter(s => s.id !== salaId));
      toast.success("Sala eliminada exitosamente");
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo eliminar la sala.");
    }
  };

  // ---------- Filtros memo ----------
  const edificiosFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    return edificios
      .filter(edificio => {
        if (edificioSeleccionado !== "todos" && String(edificio.id) !== edificioSeleccionado) return false;

        const campusNombre = getCampusNombre(edificio.campus_id).toLowerCase();
        const pisosStr = edificio.pisos != null ? String(edificio.pisos) : "";
        const edificioCoincide =
          edificio.nombre.toLowerCase().includes(term) ||
          campusNombre.includes(term) ||
          pisosStr.includes(term);

        // Buscar también por salas del edificio (código, tipo, equipamiento)
        const salasCoinciden = salas.some(sala =>
          sala.edificio_id === edificio.id &&
          (
            sala.codigo.toLowerCase().includes(term) ||
            sala.tipo.toLowerCase().includes(term) ||
            (sala.equipamiento ?? "").toLowerCase().includes(term)
          )
        );

        return term === "" || edificioCoincide || salasCoinciden;
      });
  }, [edificios, salas, edificioSeleccionado, busqueda, campus]);

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Cargando edificios y salas…
      </div>
    );
  }

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
          <Dialog open={modalEdificioAbierto} onOpenChange={setModalEdificioAbierto}>
            <DialogTrigger asChild>
              <div>
                <Button variant="default" onClick={abrirModalCrearEdificio}>
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
                  <Label htmlFor="pisos" style={{color: '#000', fontWeight: 'bold', zIndex: 10}}>Pisos (opcional)</Label>
                  <Input
                    id="pisos"
                    type="number"
                    value={formularioEdificio.pisos}
                    onChange={(e) => setFormularioEdificio(prev => ({ ...prev, pisos: e.target.value }))}
                    placeholder="5"
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
                  <Button className="!bg-gray-200 !text-black !hover:bg-gray-300 dark:!bg-gray-700 dark:!text-white dark:!hover:bg-gray-600" onClick={() => setModalEdificioAbierto(false)}>
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
                    value={editandoSala.edificioId !== "" ? String(editandoSala.edificioId) : ""}
                    onValueChange={(value) => setEditandoSala(prev => ({ ...prev, edificioId: Number(value) }))}
                    disabled={!!editandoSala.sala}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un edificio" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900">
                      {edificios.map(edificio => (
                        <SelectItem key={edificio.id} value={String(edificio.id)}>
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
                    onValueChange={(value: SalaTipo) => setFormularioSala(prev => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900">
                      <SelectItem value="aula">Aula</SelectItem>
                      <SelectItem value="laboratorio">Laboratorio</SelectItem>
                      <SelectItem value="auditorio">Auditorio</SelectItem>
                      <SelectItem value="taller">Taller</SelectItem>
                      <SelectItem value="sala_conferencias">Sala de Conferencias</SelectItem>
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
                placeholder="Buscar por sala, edificio, campus o código..."
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
                  <SelectItem key={edificio.id} value={String(edificio.id)}>
                    {edificio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo de sala" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900">
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="aula">Aula</SelectItem>
                <SelectItem value="laboratorio">Laboratorio</SelectItem>
                <SelectItem value="auditorio">Auditorio</SelectItem>
                <SelectItem value="taller">Taller</SelectItem>
                <SelectItem value="sala_conferencias">Sala de Conferencias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vista por edificios */}
      <div className="space-y-6">
        {edificiosFiltrados.map(edificio => {
          // Salas del edificio con filtros
          const salasEdificio = getSalasPorEdificio(edificio.id).filter(sala => {
            const term = busqueda.trim().toLowerCase();
            const coincideBusqueda =
              sala.codigo.toLowerCase().includes(term) ||
              sala.tipo.toLowerCase().includes(term) ||
              (sala.equipamiento ?? "").toLowerCase().includes(term) ||
              edificio.nombre.toLowerCase().includes(term) ||
              getCampusNombre(edificio.campus_id).toLowerCase().includes(term);
            const coincideTipo = filtroTipo === "todos" || sala.tipo === filtroTipo;
            return coincideBusqueda && coincideTipo;
          });

          if (salasEdificio.length === 0 && busqueda && !edificio.nombre.toLowerCase().includes(busqueda.toLowerCase())) {
            return null;
          }

          return (
            <Card key={edificio.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {edificio.nombre}
                          {edificio.pisos != null && (
                            <Badge variant="outline">
                              {edificio.pisos} {edificio.pisos === 1 ? "piso" : "pisos"}
                            </Badge>
                          )}
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
                      onClick={() => editarEdificioClick(edificio)}
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
                  {salasEdificio.map(sala => (
                    <Card key={sala.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{sala.codigo}</CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editarSalaClick(edificio.id, sala)}
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
                      </CardContent>
                    </Card>
                  ))}
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

      {edificiosFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">No hay edificios registrados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza agregando tu primer edificio para gestionar las salas
            </p>
            <Button onClick={abrirModalCrearEdificio}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Edificio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
