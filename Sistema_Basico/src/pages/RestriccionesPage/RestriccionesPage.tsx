import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Plus, Edit, Trash2, XCircle, CheckCircle, Clock, Shield, BookOpen, Settings, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { RestriccionAcademica } from "../../types";
import { restriccionesMock, asignaturasMock, edificiosMock } from "../../data/mock-data";

export function RestriccionesPage() {
  const [restricciones, setRestricciones] = useState<RestriccionAcademica[]>(restriccionesMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>("todos");
  const [filtroActiva, setFiltroActiva] = useState<string>("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoRestriccion, setEditandoRestriccion] = useState<RestriccionAcademica | null>(null);

  const [formulario, setFormulario] = useState({
    tipo: "prerrequisito" as RestriccionAcademica["tipo"],
    descripcion: "",
    prioridadFloat: 0.5,
    activa: true,
    mensaje: "",
    asignaturaOrigen: "",
    asignaturaDestino: "",
    salaProhibida: "",
    profesorRequerido: "",
    especialidadRequerida: "",
    diaRestriccion: "",
    horaInicioRestriccion: "",
    horaFinRestriccion: ""
  });

  const todasLasSalas = edificiosMock.flatMap(edificio =>
    edificio.salas.map(sala => ({ ...sala, edificio }))
  );

  const prioridadDesdeFloat = (v: number) => {
    if (v <= 0.3) return "baja";
    if (v <= 0.7) return "media";
    return "alta";
  };

  const restriccionesFiltradas = restricciones.filter(restriccion => {
    const coincideBusqueda =
      (restriccion.descripcion || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (restriccion.mensaje || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (restriccion.tipo || "").toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo = filtroTipo === "todos" || restriccion.tipo === filtroTipo;
    const coincidePrioridad = filtroPrioridad === "todos" || prioridadDesdeFloat(restriccion.prioridadFloat) === filtroPrioridad;
    const coincideActiva = filtroActiva === "todos" ||
      (filtroActiva === "activa" && restriccion.activa) ||
      (filtroActiva === "inactiva" && !restriccion.activa);

    return coincideBusqueda && coincideTipo && coincidePrioridad && coincideActiva;
  });

  const handleSubmit = () => {
    if (!formulario.descripcion || !formulario.mensaje) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    if (formulario.tipo === "prerrequisito" && (!formulario.asignaturaOrigen || !formulario.asignaturaDestino)) {
      toast.error("Para restricciones de prerrequisito se requieren asignatura origen y destino");
      return;
    }

    const confirmMessage = editandoRestriccion
      ? "¿Está seguro de que quiere actualizar esta restricción?"
      : "¿Está seguro de que quiere agregar esta restricción?";
    
    if (!window.confirm(confirmMessage)) return;

    const parametros: any = {};
    switch (formulario.tipo) {
      case "prerrequisito":
      case "secuencia_temporal":
        if (formulario.asignaturaOrigen) parametros.asignaturaOrigen = formulario.asignaturaOrigen;
        if (formulario.asignaturaDestino) parametros.asignaturaDestino = formulario.asignaturaDestino;
        break;
      case "sala_prohibida":
        if (formulario.asignaturaOrigen) parametros.asignaturaOrigen = formulario.asignaturaOrigen;
        if (formulario.salaProhibida) parametros.salaProhibida = formulario.salaProhibida;
        break;
      case "profesor_especialidad":
        if (formulario.asignaturaOrigen) parametros.asignaturaOrigen = formulario.asignaturaOrigen;
        if (formulario.especialidadRequerida) parametros.especialidadRequerida = formulario.especialidadRequerida;
        if (formulario.profesorRequerido) parametros.profesorRequerido = formulario.profesorRequerido;
        break;
      case "horario_conflicto":
        if (formulario.diaRestriccion) parametros.diaRestriccion = formulario.diaRestriccion;
        if (formulario.horaInicioRestriccion) parametros.horaInicioRestriccion = formulario.horaInicioRestriccion;
        if (formulario.horaFinRestriccion) parametros.horaFinRestriccion = formulario.horaFinRestriccion;
        break;
    }

    const nuevaRestriccion: RestriccionAcademica = {
      id: editandoRestriccion?.id || `rest_${Date.now()}`,
      tipo: formulario.tipo,
      descripcion: formulario.descripcion,
      activa: formulario.activa,
      prioridadFloat: formulario.prioridadFloat,
      prioridad: prioridadDesdeFloat(formulario.prioridadFloat),
      parametros,
      mensaje: formulario.mensaje,
      fechaCreacion: editandoRestriccion?.fechaCreacion || new Date().toISOString().split('T')[0],
      creadoPor: "admin"
    };

    if (editandoRestriccion) {
      setRestricciones(prev => prev.map(r => r.id === editandoRestriccion.id ? nuevaRestriccion : r));
      toast.success("Restricción actualizada exitosamente");
    } else {
      setRestricciones(prev => [...prev, nuevaRestriccion]);
      toast.success("Restricción agregada exitosamente");
    }

    resetFormulario();
    setModalAbierto(false);
  };

  const resetFormulario = () => {
    setFormulario({
      tipo: "prerrequisito",
      descripcion: "",
      prioridadFloat: 0.5,
      activa: true,
      mensaje: "",
      asignaturaOrigen: "",
      asignaturaDestino: "",
      salaProhibida: "",
      profesorRequerido: "",
      especialidadRequerida: "",
      diaRestriccion: "",
      horaInicioRestriccion: "",
      horaFinRestriccion: ""
    });
    setEditandoRestriccion(null);
  };

  const editarRestriccion = (restriccion: RestriccionAcademica) => {
    setFormulario({
      tipo: restriccion.tipo,
      descripcion: restriccion.descripcion,
      prioridadFloat: restriccion.prioridadFloat,
      activa: restriccion.activa,
      mensaje: restriccion.mensaje,
      asignaturaOrigen: restriccion.parametros.asignaturaOrigen || "",
      asignaturaDestino: restriccion.parametros.asignaturaDestino || "",
      salaProhibida: restriccion.parametros.salaProhibida || "",
      profesorRequerido: restriccion.parametros.profesorRequerido || "",
      especialidadRequerida: restriccion.parametros.especialidadRequerida || "",
      diaRestriccion: restriccion.parametros.diaRestriccion || "",
      horaInicioRestriccion: restriccion.parametros.horaInicioRestriccion || "",
      horaFinRestriccion: restriccion.parametros.horaFinRestriccion || ""
    });
    setEditandoRestriccion(restriccion);
    setModalAbierto(true);
  };

  const eliminarRestriccion = (id: string) => {
    if (!window.confirm("¿Está seguro de que quiere eliminar esta restricción?")) return;
    setRestricciones(prev => prev.filter(r => r.id !== id));
    toast.success("Restricción eliminada exitosamente");
  };

  const toggleActivarRestriccion = (id: string) => {
    setRestricciones(prev => prev.map(r =>
      r.id === id ? { ...r, activa: !r.activa } : r
    ));
    const restriccion = restricciones.find(r => r.id === id);
    toast.success(`Restricción ${restriccion?.activa ? "desactivada" : "activada"} exitosamente`);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "prerrequisito": return <BookOpen className="w-4 h-4" />;
      case "sala_prohibida": return <Shield className="w-4 h-4" />;
      case "horario_conflicto": return <Clock className="w-4 h-4" />;
      case "profesor_especialidad": return <Settings className="w-4 h-4" />;
      case "secuencia_temporal": return <AlertTriangle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const renderParametrosEspecificos = () => {
    switch (formulario.tipo) {
      case "prerrequisito":
      case "secuencia_temporal":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Asignatura Origen</Label>
              <Select value={formulario.asignaturaOrigen} onValueChange={(v) => setFormulario(prev => ({ ...prev, asignaturaOrigen: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(a => <SelectItem key={a.id} value={a.codigo}>{a.codigo} - {a.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Asignatura Destino</Label>
              <Select value={formulario.asignaturaDestino} onValueChange={(v) => setFormulario(prev => ({ ...prev, asignaturaDestino: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(a => <SelectItem key={a.id} value={a.codigo}>{a.codigo} - {a.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "sala_prohibida":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Asignatura</Label>
              <Select value={formulario.asignaturaOrigen} onValueChange={(v) => setFormulario(prev => ({ ...prev, asignaturaOrigen: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(a => <SelectItem key={a.id} value={a.codigo}>{a.codigo} - {a.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Sala Prohibida</Label>
              <Select value={formulario.salaProhibida} onValueChange={(v) => setFormulario(prev => ({ ...prev, salaProhibida: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aula">Aula</SelectItem>
                  <SelectItem value="laboratorio">Laboratorio</SelectItem>
                  <SelectItem value="auditorio">Auditorio</SelectItem>
                  <SelectItem value="sala_computacion">Sala de Computación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "profesor_especialidad":
        return (
          <div className="space-y-4">
            <div>
              <Label>Asignatura</Label>
              <Select value={formulario.asignaturaOrigen} onValueChange={(v) => setFormulario(prev => ({ ...prev, asignaturaOrigen: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(a => <SelectItem key={a.id} value={a.codigo}>{a.codigo} - {a.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Especialidad Requerida</Label>
              <Input value={formulario.especialidadRequerida} onChange={(e) => setFormulario(prev => ({ ...prev, especialidadRequerida: e.target.value }))} placeholder="Matemáticas, Física, etc." />
            </div>
            <div>
              <Label>Profesor Requerido</Label>
              <Input value={formulario.profesorRequerido} onChange={(e) => setFormulario(prev => ({ ...prev, profesorRequerido: e.target.value }))} placeholder="Nombre del profesor" />
            </div>
          </div>
        );
      case "horario_conflicto":
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Día</Label>
              <Select value={formulario.diaRestriccion} onValueChange={(v) => setFormulario(prev => ({ ...prev, diaRestriccion: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar día" /></SelectTrigger>
                <SelectContent>
                  {diasSemana.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hora Inicio</Label>
              <Input type="time" value={formulario.horaInicioRestriccion} onChange={(e) => setFormulario(prev => ({ ...prev, horaInicioRestriccion: e.target.value }))} />
            </div>
            <div>
              <Label>Hora Fin</Label>
              <Input type="time" value={formulario.horaFinRestriccion} onChange={(e) => setFormulario(prev => ({ ...prev, horaFinRestriccion: e.target.value }))} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input placeholder="Buscar restricción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="flex-1" />
        <div className="flex gap-2">
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="prerrequisito">Prerrequisito</SelectItem>
              <SelectItem value="secuencia_temporal">Secuencia Temporal</SelectItem>
              <SelectItem value="sala_prohibida">Sala Prohibida</SelectItem>
              <SelectItem value="profesor_especialidad">Profesor/Especialidad</SelectItem>
              <SelectItem value="horario_conflicto">Horario Conflicto</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
            <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroActiva} onValueChange={setFiltroActiva}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="inactiva">Inactiva</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setModalAbierto(true)} variant="secondary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Restricción
          </Button>
        </div>
      </div>

      {/* Lista de restricciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restriccionesFiltradas.map(r => (
          <Card key={r.id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                {getTipoIcon(r.tipo)} {r.tipo.replace("_", " ")}
              </CardTitle>
              <Badge className={prioridadDesdeFloat(r.prioridadFloat) === "alta" ? "bg-red-500" :
                prioridadDesdeFloat(r.prioridadFloat) === "media" ? "bg-yellow-500" : "bg-green-500"}>
                {prioridadDesdeFloat(r.prioridadFloat)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{r.descripcion}</p>
              <p className="text-xs text-gray-500">{r.mensaje}</p>

              {/* Botones reemplazados */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => editarRestriccion(r)} className="flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Editar
                </Button>
                <Button size="sm" variant="outline" onClick={() => eliminarRestriccion(r.id)} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleActivarRestriccion(r.id)} className="flex items-center gap-2">
                  {r.activa ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  {r.activa ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal para agregar/editar */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editandoRestriccion ? "Editar Restricción" : "Nueva Restricción"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de Restricción</Label>
              <Select value={formulario.tipo} onValueChange={(v: RestriccionAcademica["tipo"]) => setFormulario(prev => ({ ...prev, tipo: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="prerrequisito">Prerrequisito</SelectItem>
                  <SelectItem value="secuencia_temporal">Secuencia Temporal</SelectItem>
                  <SelectItem value="sala_prohibida">Sala Prohibida</SelectItem>
                  <SelectItem value="profesor_especialidad">Profesor/Especialidad</SelectItem>
                  <SelectItem value="horario_conflicto">Horario Conflicto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea value={formulario.descripcion} onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))} />
            </div>

            <div>
              <Label>Mensaje</Label>
              <Textarea value={formulario.mensaje} onChange={(e) => setFormulario(prev => ({ ...prev, mensaje: e.target.value }))} />
            </div>

            <div>
              <Label>Prioridad (0 baja - 1 alta)</Label>
              <Input type="range" min={0} max={1} step={0.01} value={formulario.prioridadFloat} onChange={(e) => setFormulario(prev => ({ ...prev, prioridadFloat: parseFloat(e.target.value) }))} />
            </div>

            <div>
              <Label>Activa</Label>
              <Select value={formulario.activa ? "true" : "false"} onValueChange={(v) => setFormulario(prev => ({ ...prev, activa: v === "true" }))}>
                <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activa</SelectItem>
                  <SelectItem value="false">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {renderParametrosEspecificos()}

            <Button onClick={handleSubmit} className="w-full">{editandoRestriccion ? "Actualizar" : "Agregar"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
