import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Switch } from "../../components/ui/switch";
import { Plus, Search, Settings, AlertTriangle, CheckCircle, XCircle, Edit, Trash2, Clock, Shield, BookOpen } from "lucide-react";
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
  const [dialogConfirmacionAbierto, setDialogConfirmacionAbierto] = useState(false);
  const [accionAConfirmar, setAccionAConfirmar] = useState<"crear" | "eliminar" | null>(null);
  const [restriccionObjetivo, setRestriccionObjetivo] = useState<RestriccionAcademica | null>(null);

  const [formulario, setFormulario] = useState({
    tipo: "prerrequisito" as RestriccionAcademica["tipo"],
    descripcion: "",
    prioridad: 0.5, // ✅ valor numérico (media)
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

  // =====================================
  // Funciones auxiliares
  // =====================================
  const getPrioridadLabel = (valor: number) => {
    if (valor <= 0.3) return "baja";
    if (valor <= 0.7) return "media";
    return "alta";
  };

  const getPrioridadColor = (valor: number) => {
    if (valor <= 0.3) return "bg-green-100 text-green-800";
    if (valor <= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Obtener todas las salas
  const todasLasSalas = edificiosMock.flatMap(edificio =>
    edificio.salas.map(sala => ({ ...sala, edificio }))
  );

  // =====================================
  // Filtrado
  // =====================================
  const restriccionesFiltradas = restricciones.filter(r => {
    const coincideBusqueda =
      (r.descripcion || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.mensaje || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.tipo || "").toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo = filtroTipo === "todos" || r.tipo === filtroTipo;

    const coincidePrioridad =
      filtroPrioridad === "todos" ||
      (filtroPrioridad === "baja" && r.prioridad <= 0.3) ||
      (filtroPrioridad === "media" && r.prioridad > 0.3 && r.prioridad <= 0.7) ||
      (filtroPrioridad === "alta" && r.prioridad > 0.7);

    const coincideActiva =
      filtroActiva === "todos" ||
      (filtroActiva === "activa" && r.activa) ||
      (filtroActiva === "inactiva" && !r.activa);

    return coincideBusqueda && coincideTipo && coincidePrioridad && coincideActiva;
  });

  // =====================================
  // Contadores de resumen
  // =====================================
  const totalActivas = restricciones.filter(r => r.activa).length;
  const totalAlta = restricciones.filter(r => r.prioridad > 0.7).length;
  const totalMedia = restricciones.filter(r => r.prioridad > 0.3 && r.prioridad <= 0.7).length;
  const totalBaja = restricciones.filter(r => r.prioridad <= 0.3).length;
  const total = restricciones.length;

  // =====================================
  // Handlers
  // =====================================
  const handleSubmit = () => {
    if (!formulario.descripcion || !formulario.mensaje) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const parametros: any = {};

    switch (formulario.tipo) {
      case "prerrequisito":
      case "secuencia_temporal":
        parametros.asignaturaOrigen = formulario.asignaturaOrigen;
        parametros.asignaturaDestino = formulario.asignaturaDestino;
        break;
      case "sala_prohibida":
        parametros.asignaturaOrigen = formulario.asignaturaOrigen;
        parametros.salaProhibida = formulario.salaProhibida;
        break;
      case "profesor_especialidad":
        parametros.asignaturaOrigen = formulario.asignaturaOrigen;
        parametros.profesorRequerido = formulario.profesorRequerido;
        parametros.especialidadRequerida = formulario.especialidadRequerida;
        break;
      case "horario_conflicto":
        parametros.diaRestriccion = formulario.diaRestriccion;
        parametros.horaInicioRestriccion = formulario.horaInicioRestriccion;
        parametros.horaFinRestriccion = formulario.horaFinRestriccion;
        break;
    }

    const nuevaRestriccion: RestriccionAcademica = {
      id: editandoRestriccion?.id || `rest_${Date.now()}`,
      tipo: formulario.tipo,
      descripcion: formulario.descripcion,
      activa: formulario.activa,
      prioridad: formulario.prioridad, // ✅ ahora es float
      parametros,
      mensaje: formulario.mensaje,
      fechaCreacion: editandoRestriccion?.fechaCreacion || new Date().toISOString().split('T')[0],
      creadoPor: "admin"
    };

    if (editandoRestriccion) {
      setRestricciones(prev => prev.map(r => r.id === editandoRestriccion.id ? nuevaRestriccion : r));
      toast.success("Restricción actualizada exitosamente");
    } else {
      abrirConfirmacion("crear", nuevaRestriccion);
      setModalAbierto(false);
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setFormulario({
      tipo: "prerrequisito",
      descripcion: "",
      prioridad: 0.5, // ✅ default media
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

  const abrirConfirmacion = (accion: "crear" | "eliminar", restriccion?: RestriccionAcademica) => {
    setAccionAConfirmar(accion);
    setRestriccionObjetivo(restriccion || null);
    setDialogConfirmacionAbierto(true);
  };

  const confirmarAccion = () => {
    if (accionAConfirmar === "eliminar" && restriccionObjetivo) {
      setRestricciones(prev => prev.filter(r => r.id !== restriccionObjetivo.id));
    }
    if (accionAConfirmar === "crear" && restriccionObjetivo) {
      setRestricciones(prev => [...prev, restriccionObjetivo]);
    }
    setDialogConfirmacionAbierto(false);
    setAccionAConfirmar(null);
    setRestriccionObjetivo(null);
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

  // =====================================
  // Render
  // =====================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">Gestión de Restricciones Académicas</h2>
          <p className="text-muted-foreground">
            Define y administra las reglas que rigen la programación académica
          </p>
        </div>

        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogTrigger asChild>
            <Button onClick={resetFormulario}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Restricción
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editandoRestriccion ? "Editar Restricción" : "Agregar Nueva Restricción"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Restricción</Label>
                  <Select value={formulario.tipo} onValueChange={(value: any) =>
                    setFormulario(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prerrequisito">Prerrequisito</SelectItem>
                      <SelectItem value="sala_prohibida">Sala Prohibida</SelectItem>
                      <SelectItem value="horario_conflicto">Conflicto de Horario</SelectItem>
                      <SelectItem value="profesor_especialidad">Especialidad de Profesor</SelectItem>
                      <SelectItem value="secuencia_temporal">Secuencia Temporal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Descripción *</Label>
                  <Input
                    value={formulario.descripcion}
                    onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción breve de la restricción"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensaje de Error *</Label>
                  <Textarea
                    value={formulario.mensaje}
                    onChange={(e) => setFormulario(prev => ({ ...prev, mensaje: e.target.value }))}
                    placeholder="Mensaje que se mostrará cuando no se cumpla la restricción"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prioridad</Label>
                    <Select
                      value={getPrioridadLabel(formulario.prioridad)}
                      onValueChange={(value: string) => {
                        let prioridad = 0.5;
                        if (value === "baja") prioridad = 0.2;
                        if (value === "media") prioridad = 0.5;
                        if (value === "alta") prioridad = 0.9;
                        setFormulario(prev => ({ ...prev, prioridad }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <div className="flex items-center space-x-2 h-10">
                      <Switch
                        checked={formulario.activa}
                        onCheckedChange={(checked) => setFormulario(prev => ({ ...prev, activa: checked }))}
                      />
                      <span className="text-sm">
                        {formulario.activa ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editandoRestriccion ? "Actualizar" : "Agregar"} Restricción
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar restricciones..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="prerrequisito">Prerrequisito</SelectItem>
                <SelectItem value="sala_prohibida">Sala Prohibida</SelectItem>
                <SelectItem value="horario_conflicto">Conflicto de Horario</SelectItem>
                <SelectItem value="profesor_especialidad">Especialidad de Profesor</SelectItem>
                <SelectItem value="secuencia_temporal">Secuencia Temporal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroActiva} onValueChange={setFiltroActiva}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activa">Activas</SelectItem>
                <SelectItem value="inactiva">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{totalActivas}</p>
                <p className="text-sm text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{totalAlta}</p>
                <p className="text-sm text-muted-foreground">Alta Prioridad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{totalMedia}</p>
                <p className="text-sm text-muted-foreground">Media Prioridad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{totalBaja}</p>
                <p className="text-sm text-muted-foreground">Baja Prioridad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de restricciones */}
      <div className="space-y-4">
        {restriccionesFiltradas.map((restriccion) => (
          <Card key={restriccion.id} className={`hover:shadow-md transition-shadow ${!restriccion.activa ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getTipoIcon(restriccion.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{restriccion.descripcion}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {restriccion.tipo.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPrioridadColor(restriccion.prioridad)}>
                        {getPrioridadLabel(restriccion.prioridad)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {restriccion.activa ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {restriccion.activa ? "Activa" : "Inactiva"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleActivarRestriccion(restriccion.id)}>
                    {restriccion.activa ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditandoRestriccion(restriccion) || setModalAbierto(true)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => abrirConfirmacion("eliminar", restriccion)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {restriccion.mensaje}
                </AlertDescription>
              </Alert>
              <div className="text-xs text-muted-foreground border-t pt-2">
                Creado el {restriccion.fechaCreacion} por {restriccion.creadoPor}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
