import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Edit,
  Trash2,
  MapPin,
  User,
  Eye,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { HorarioManual } from "../../types";
import {
  horariosManualMock,
  profesoresMock,
  edificiosMock,
  asignaturasMock,
} from "../../data/mock-data";

export function HorariosPage() {
  const [horarios, setHorarios] = useState<HorarioManual[]>(
    horariosManualMock,
  );
  const [busqueda, setBusqueda] = useState("");
  const [filtroSala, setFiltroSala] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] =
    useState<string>("todos");
  const [vistaCalendario, setVistaCalendario] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoHorario, setEditandoHorario] =
    useState<HorarioManual | null>(null);

  const [formulario, setFormulario] = useState({
    titulo: "",
    descripcion: "",
    salaId: "",
    dia: "",
    horaInicio: "",
    horaFin: "",
    profesorId: "",
    asignaturaId: "",
    color: "#3B82F6",
    estado: "activo" as "activo" | "cancelado" | "reprogramado",
    recurrente: false,
    fechaInicio: "",
    fechaFin: "",
  });

  // Obtener todas las salas de todos los edificios
  const todasLasSalas = edificiosMock.flatMap((edificio) =>
    edificio.salas.map((sala) => ({ ...sala, edificio })),
  );

  const horariosGiltrados = horarios.filter((horario) => {
    const coincideBusqueda =
      horario.titulo
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (horario.descripcion || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideSala =
      filtroSala === "todos" || horario.salaId === filtroSala;
    const coincideEstado =
      filtroEstado === "todos" ||
      horario.estado === filtroEstado;

    return coincideBusqueda && coincideSala && coincideEstado;
  });

  const handleSubmit = () => {
    if (
      !formulario.titulo ||
      !formulario.salaId ||
      !formulario.dia ||
      !formulario.horaInicio ||
      !formulario.horaFin
    ) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    // Validar que la hora de inicio sea menor que la hora de fin
    if (formulario.horaInicio >= formulario.horaFin) {
      toast.error(
        "La hora de inicio debe ser menor que la hora de fin",
      );
      return;
    }

    // Verificar conflictos de horarios
    const conflicto = horarios.find(
      (h) =>
        h.id !== editandoHorario?.id &&
        h.salaId === formulario.salaId &&
        h.dia === formulario.dia &&
        h.estado === "activo" &&
        ((formulario.horaInicio >= h.horaInicio &&
          formulario.horaInicio < h.horaFin) ||
          (formulario.horaFin > h.horaInicio &&
            formulario.horaFin <= h.horaFin) ||
          (formulario.horaInicio <= h.horaInicio &&
            formulario.horaFin >= h.horaFin)),
    );

    if (conflicto) {
      toast.error(
        `Conflicto de horario con: ${conflicto.titulo} (${conflicto.horaInicio}-${conflicto.horaFin})`,
      );
      return;
    }

    const nuevoHorario: HorarioManual = {
      id: editandoHorario?.id || `horario_${Date.now()}`,
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      salaId: formulario.salaId,
      dia: formulario.dia,
      horaInicio: formulario.horaInicio,
      horaFin: formulario.horaFin,
      profesorId:
        formulario.profesorId === "no_profesor"
          ? undefined
          : formulario.profesorId || undefined,
      asignaturaId:
        formulario.asignaturaId === "no_asignatura"
          ? undefined
          : formulario.asignaturaId || undefined,
      color: formulario.color,
      estado: formulario.estado,
      fechaCreacion:
        editandoHorario?.fechaCreacion ||
        new Date().toISOString().split("T")[0],
      creadoPor: "admin",
      recurrente: formulario.recurrente,
      fechaInicio: formulario.fechaInicio || undefined,
      fechaFin: formulario.fechaFin || undefined,
    };

    if (editandoHorario) {
      setHorarios((prev) =>
        prev.map((h) =>
          h.id === editandoHorario.id ? nuevoHorario : h,
        ),
      );
      toast.success("Horario actualizado exitosamente");
    } else {
      setHorarios((prev) => [...prev, nuevoHorario]);
      toast.success("Horario agregado exitosamente");
    }

    resetFormulario();
    setModalAbierto(false);
  };

  const resetFormulario = () => {
    setFormulario({
      titulo: "",
      descripcion: "",
      salaId: "",
      dia: "",
      horaInicio: "",
      horaFin: "",
      profesorId: "",
      asignaturaId: "",
      color: "#3B82F6",
      estado: "activo",
      recurrente: false,
      fechaInicio: "",
      fechaFin: "",
    });
    setEditandoHorario(null);
  };

  const editarHorario = (horario: HorarioManual) => {
    setFormulario({
      titulo: horario.titulo,
      descripcion: horario.descripcion || "",
      salaId: horario.salaId,
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      profesorId: horario.profesorId || "",
      asignaturaId: horario.asignaturaId || "",
      color: horario.color || "#3B82F6",
      estado: horario.estado,
      recurrente: horario.recurrente,
      fechaInicio: horario.fechaInicio || "",
      fechaFin: horario.fechaFin || "",
    });
    setEditandoHorario(horario);
    setModalAbierto(true);
  };

  const eliminarHorario = (id: string) => {
    setHorarios((prev) => prev.filter((h) => h.id !== id));
    toast.success("Horario eliminado exitosamente");
  };

  const cambiarEstadoHorario = (
    id: string,
    nuevoEstado: HorarioManual["estado"],
  ) => {
    setHorarios((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, estado: nuevoEstado } : h,
      ),
    );
    toast.success(`Horario ${nuevoEstado} exitosamente`);
  };

  const getSalaNombre = (salaId: string) => {
    const sala = todasLasSalas.find((s) => s.id === salaId);
    return sala
      ? `${sala.numero} (${sala.edificio.codigo})`
      : "Sala no encontrada";
  };

  const getProfesorNombre = (profesorId?: string) => {
    if (!profesorId) return "Sin asignar";
    const profesor = profesoresMock.find(
      (p) => p.id === profesorId,
    );
    return profesor
      ? `${profesor.nombre} ${profesor.apellido}`
      : "Profesor no encontrado";
  };

  const getAsignaturaNombre = (asignaturaId?: string) => {
    if (!asignaturaId) return null;
    const asignatura = asignaturasMock.find(
      (a) => a.id === asignaturaId,
    );
    return asignatura ? asignatura.codigo : null;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      case "reprogramado":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const horasDelDia = Array.from({ length: 15 }, (_, i) => {
    const hora = 7 + i;
    return `${hora.toString().padStart(2, "0")}:00`;
  });

  const coloresDisponibles = [
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6B7280",
  ];

  // Vista de calendario semanal
  const renderVistaCalendario = () => {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-2 min-w-[800px]">
                {/* Header */}
                <div className="font-medium text-center py-2">
                  Hora
                </div>
                {diasSemana.map((dia) => (
                  <div
                    key={dia}
                    className="font-medium text-center py-2 border-l"
                  >
                    {dia}
                  </div>
                ))}

                {/* Filas de horarios */}
                {horasDelDia.map((hora) => (
                  <div key={hora} className="contents">
                    <div className="text-sm text-muted-foreground text-center py-3 border-t">
                      {hora}
                    </div>
                    {diasSemana.map((dia) => {
                      const horariosEnEsteSlot =
                        horariosGiltrados.filter(
                          (h) =>
                            h.dia === dia &&
                            h.horaInicio <= hora &&
                            h.horaFin > hora &&
                            h.estado === "activo",
                        );

                      return (
                        <div
                          key={`${dia}-${hora}`}
                          className="border-l border-t min-h-[60px] p-1"
                        >
                          {horariosEnEsteSlot.map((horario) => (
                            <div
                              key={horario.id}
                              className="text-xs p-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                              style={{
                                backgroundColor:
                                  horario.color + "20",
                                borderLeft: `3px solid ${horario.color}`,
                              }}
                              onClick={() =>
                                editarHorario(horario)
                              }
                            >
                              <div className="font-medium truncate">
                                {horario.titulo}
                              </div>
                              <div className="text-gray-600">
                                {horario.horaInicio}-
                                {horario.horaFin}
                              </div>
                              {horario.profesorId && (
                                <div className="text-gray-500 truncate">
                                  {getProfesorNombre(
                                    horario.profesorId,
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Vista de lista
  const renderVistaLista = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {horariosGiltrados.map((horario) => (
          <Card
            key={horario.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="w-4 h-16 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: horario.color }}
                  ></div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {horario.titulo}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        className={getEstadoColor(
                          horario.estado,
                        )}
                      >
                        {horario.estado}
                      </Badge>
                      {horario.recurrente && (
                        <Badge variant="outline">
                          Recurrente
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editarHorario(horario)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarHorario(horario.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {horario.descripcion && (
                <p className="text-sm text-muted-foreground">
                  {horario.descripcion}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{getSalaNombre(horario.salaId)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{horario.dia}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {horario.horaInicio} - {horario.horaFin}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {getProfesorNombre(horario.profesorId)}
                  </span>
                </div>
              </div>

              {getAsignaturaNombre(horario.asignaturaId) && (
                <Badge variant="secondary">
                  {getAsignaturaNombre(horario.asignaturaId)}
                </Badge>
              )}

              {horario.recurrente &&
                (horario.fechaInicio || horario.fechaFin) && (
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>
                      Período: {horario.fechaInicio} -{" "}
                      {horario.fechaFin}
                    </p>
                  </div>
                )}

              {horario.estado !== "activo" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      cambiarEstadoHorario(horario.id, "activo")
                    }
                  >
                    Reactivar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">Gestión de Horarios</h2>
          <p className="text-muted-foreground">
            Programa horarios de clases en salas específicas de
            manera manual
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setVistaCalendario(!vistaCalendario)}
          >
            {vistaCalendario ? (
              <Eye className="w-4 h-4 mr-2" />
            ) : (
              <Calendar className="w-4 h-4 mr-2" />
            )}
            {vistaCalendario
              ? "Vista Lista"
              : "Vista Calendario"}
          </Button>

          <Dialog
            open={modalAbierto}
            onOpenChange={setModalAbierto}
          >
            <DialogTrigger asChild>
              <div>
                <Button onClick={resetFormulario}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Horario
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editandoHorario
                    ? "Editar Horario"
                    : "Agregar Nuevo Horario"}
                </DialogTitle>
                <DialogDescription>
                  {editandoHorario
                    ? "Edita el horario seleccionado"
                    : "Agrega un nuevo horario"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formulario.titulo}
                    onChange={(e) =>
                      setFormulario((prev) => ({
                        ...prev,
                        titulo: e.target.value,
                      }))
                    }
                    placeholder="Clase de Matemáticas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formulario.descripcion}
                    onChange={(e) =>
                      setFormulario((prev) => ({
                        ...prev,
                        descripcion: e.target.value,
                      }))
                    }
                    placeholder="Descripción opcional del horario"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sala">Sala *</Label>
                    <Select
                      value={formulario.salaId}
                      onValueChange={(value) =>
                        setFormulario((prev) => ({
                          ...prev,
                          salaId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sala" />
                      </SelectTrigger>
                      <SelectContent>
                        {todasLasSalas.map((sala) => (
                          <SelectItem
                            key={sala.id}
                            value={sala.id}
                          >
                            {sala.numero} -{" "}
                            {sala.edificio.nombre} (Cap:{" "}
                            {sala.capacidad})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dia">Día *</Label>
                    <Select
                      value={formulario.dia}
                      onValueChange={(value) =>
                        setFormulario((prev) => ({
                          ...prev,
                          dia: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar día" />
                      </SelectTrigger>
                      <SelectContent>
                        {diasSemana.map((dia) => (
                          <SelectItem key={dia} value={dia}>
                            {dia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaInicio">
                      Hora Inicio *
                    </Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      value={formulario.horaInicio}
                      onChange={(e) =>
                        setFormulario((prev) => ({
                          ...prev,
                          horaInicio: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaFin">Hora Fin *</Label>
                    <Input
                      id="horaFin"
                      type="time"
                      value={formulario.horaFin}
                      onChange={(e) =>
                        setFormulario((prev) => ({
                          ...prev,
                          horaFin: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profesor">Profesor</Label>
                    <Select
                      value={formulario.profesorId}
                      onValueChange={(value) =>
                        setFormulario((prev) => ({
                          ...prev,
                          profesorId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar profesor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_profesor">
                          Sin asignar
                        </SelectItem>
                        {profesoresMock
                          .filter((p) => p.estado === "activo")
                          .map((profesor) => (
                            <SelectItem
                              key={profesor.id}
                              value={profesor.id}
                            >
                              {profesor.nombre}{" "}
                              {profesor.apellido}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asignatura">
                      Asignatura (opcional)
                    </Label>
                    <Select
                      value={formulario.asignaturaId}
                      onValueChange={(value) =>
                        setFormulario((prev) => ({
                          ...prev,
                          asignaturaId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Relacionar con asignatura" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_asignatura">
                          Sin relacionar
                        </SelectItem>
                        {asignaturasMock.map((asignatura) => (
                          <SelectItem
                            key={asignatura.id}
                            value={asignatura.id}
                          >
                            {asignatura.codigo} -{" "}
                            {asignatura.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {coloresDisponibles.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            formulario.color === color
                              ? "border-gray-900"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            setFormulario((prev) => ({
                              ...prev,
                              color,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={formulario.estado}
                      onValueChange={(value: any) =>
                        setFormulario((prev) => ({
                          ...prev,
                          estado: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">
                          Activo
                        </SelectItem>
                        <SelectItem value="cancelado">
                          Cancelado
                        </SelectItem>
                        <SelectItem value="reprogramado">
                          Reprogramado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formulario.recurrente}
                      onCheckedChange={(checked) =>
                        setFormulario((prev) => ({
                          ...prev,
                          recurrente: checked,
                        }))
                      }
                    />
                    <Label>Horario recurrente</Label>
                  </div>

                  {formulario.recurrente && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fechaInicio">
                          Fecha Inicio
                        </Label>
                        <Input
                          id="fechaInicio"
                          type="date"
                          value={formulario.fechaInicio}
                          onChange={(e) =>
                            setFormulario((prev) => ({
                              ...prev,
                              fechaInicio: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaFin">
                          Fecha Fin
                        </Label>
                        <Input
                          id="fechaFin"
                          type="date"
                          value={formulario.fechaFin}
                          onChange={(e) =>
                            setFormulario((prev) => ({
                              ...prev,
                              fechaFin: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setModalAbierto(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editandoHorario ? "Actualizar" : "Agregar"}{" "}
                    Horario
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
                placeholder="Buscar por título o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filtroSala}
              onValueChange={setFiltroSala}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">
                  Todas las salas
                </SelectItem>
                {todasLasSalas.map((sala) => (
                  <SelectItem key={sala.id} value={sala.id}>
                    {sala.numero} - {sala.edificio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filtroEstado}
              onValueChange={setFiltroEstado}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">
                  Todos los estados
                </SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="cancelado">
                  Cancelados
                </SelectItem>
                <SelectItem value="reprogramado">
                  Reprogramados
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    horarios.filter(
                      (h) => h.estado === "activo",
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  Horarios Activos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">
                  {horarios.filter((h) => h.recurrente).length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Recurrentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">
                  {horarios.filter((h) => h.profesorId).length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Con Profesor
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">
                  {todasLasSalas.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Salas Disponibles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      {vistaCalendario
        ? renderVistaCalendario()
        : renderVistaLista()}

      {horariosGiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">
              No se encontraron horarios
            </h3>
            <p className="text-muted-foreground">
              {busqueda ||
              filtroSala !== "todos" ||
              filtroEstado !== "todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primer horario manual"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}