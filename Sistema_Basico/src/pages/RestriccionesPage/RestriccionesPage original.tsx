import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Switch } from "../../components/ui/switch";
import { Plus, Search, Settings, AlertTriangle, CheckCircle, XCircle, Edit, Trash2, Clock, Shield, BookOpen } from "lucide-react";
import { toast } from "sonner";;
import type { RestriccionAcademica } from "../../types";
import { restriccionesMock, asignaturasMock, profesoresMock, edificiosMock } from "../../data/mock-data";

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
    prioridad: "media" as "alta" | "media" | "baja",
    activa: true,
    mensaje: "",
    // Parámetros específicos por tipo
    asignaturaOrigen: "",
    asignaturaDestino: "",
    salaProhibida: "",
    profesorRequerido: "",
    especialidadRequerida: "",
    diaRestriccion: "",
    horaInicioRestriccion: "",
    horaFinRestriccion: ""
  });

  // Obtener todas las salas de todos los edificios
  const todasLasSalas = edificiosMock.flatMap(edificio => 
    edificio.salas.map(sala => ({ ...sala, edificio }))
  );

  const restriccionesFiltradas = restricciones.filter(restriccion => {
    const coincideBusqueda = 
      (restriccion.descripcion || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (restriccion.mensaje || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (restriccion.tipo || "").toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideTipo = filtroTipo === "todos" || restriccion.tipo === filtroTipo;
    const coincidePrioridad = filtroPrioridad === "todos" || restriccion.prioridad === filtroPrioridad;
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

    // Validar parámetros específicos según el tipo
    if (formulario.tipo === "prerrequisito" && (!formulario.asignaturaOrigen || !formulario.asignaturaDestino)) {
      toast.error("Para restricciones de prerrequisito se requieren asignatura origen y destino");
      return;
    }

    const parametros: any = {};
    
    // Agregar parámetros según el tipo
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
      prioridad: formulario.prioridad,
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
      prioridad: "media",
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
      prioridad: restriccion.prioridad,
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

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baja": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAsignaturaNombre = (codigo: string) => {
    const asignatura = asignaturasMock.find(a => a.codigo === codigo);
    return asignatura ? `${asignatura.codigo} - ${asignatura.nombre}` : codigo;
  };

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const renderParametrosEspecificos = () => {
    switch (formulario.tipo) {
      case "prerrequisito":
      case "secuencia_temporal":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asignatura Origen</Label>
              <Select value={formulario.asignaturaOrigen} onValueChange={(value) => 
                setFormulario(prev => ({ ...prev, asignaturaOrigen: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(asig => (
                    <SelectItem key={asig.id} value={asig.codigo}>
                      {asig.codigo} - {asig.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Asignatura Destino</Label>
              <Select value={formulario.asignaturaDestino} onValueChange={(value) => 
                setFormulario(prev => ({ ...prev, asignaturaDestino: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(asig => (
                    <SelectItem key={asig.id} value={asig.codigo}>
                      {asig.codigo} - {asig.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "sala_prohibida":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asignatura</Label>
              <Select value={formulario.asignaturaOrigen} onValueChange={(value) => 
                setFormulario(prev => ({ ...prev, asignaturaOrigen: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(asig => (
                    <SelectItem key={asig.id} value={asig.codigo}>
                      {asig.codigo} - {asig.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Sala Prohibida</Label>
              <Select value={formulario.salaProhibida} onValueChange={(value) => 
                setFormulario(prev => ({ ...prev, salaProhibida: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
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
            <div className="space-y-2">
              <Label>Asignatura</Label>
              <Select value={formulario.asignaturaOrigen} onValueChange={(value) => 
                setFormulario(prev => ({ ...prev, asignaturaOrigen: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(asig => (
                    <SelectItem key={asig.id} value={asig.codigo}>
                      {asig.codigo} - {asig.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Especialidad Requerida</Label>
              <Input
                value={formulario.especialidadRequerida}
                onChange={(e) => setFormulario(prev => ({ ...prev, especialidadRequerida: e.target.value }))}
                placeholder="Matemáticas, Física, etc."
              />
            </div>
          </div>
        );

      case "horario_conflicto":
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Día</Label>
              <Select value={formulario.diaRestriccion} onValueChange={(value) => 
                setFormulario(prev => ({ ...prev, diaRestriccion: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar día" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los días</SelectItem>
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
                value={formulario.horaInicioRestriccion}
                onChange={(e) => setFormulario(prev => ({ ...prev, horaInicioRestriccion: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Hora Fin</Label>
              <Input
                type="time"
                value={formulario.horaFinRestriccion}
                onChange={(e) => setFormulario(prev => ({ ...prev, horaFinRestriccion: e.target.value }))}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            <div>
              <Button onClick={resetFormulario}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Restricción
              </Button>
            </div>
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
                    <Select value={formulario.prioridad} onValueChange={(value: any) => 
                      setFormulario(prev => ({ ...prev, prioridad: value }))}>
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

              {/* Parámetros específicos */}
              <div className="space-y-4">
                <h4>Parámetros Específicos</h4>
                {renderParametrosEspecificos()}
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

      {/* Resumen de restricciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{restricciones.filter(r => r.activa).length}</p>
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
                <p className="text-2xl font-bold">{restricciones.filter(r => r.prioridad === 'alta').length}</p>
                <p className="text-sm text-muted-foreground">Alta Prioridad</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{restricciones.filter(r => r.tipo === 'prerrequisito').length}</p>
                <p className="text-sm text-muted-foreground">Prerrequisitos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{restricciones.length}</p>
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
                        {restriccion.prioridad}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActivarRestriccion(restriccion.id)}
                  >
                    {restriccion.activa ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editarRestriccion(restriccion)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarRestriccion(restriccion.id)}
                  >
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

              {/* Mostrar parámetros específicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {restriccion.parametros.asignaturaOrigen && (
                  <div>
                    <strong>Asignatura Origen:</strong> {getAsignaturaNombre(restriccion.parametros.asignaturaOrigen)}
                  </div>
                )}
                {restriccion.parametros.asignaturaDestino && (
                  <div>
                    <strong>Asignatura Destino:</strong> {getAsignaturaNombre(restriccion.parametros.asignaturaDestino)}
                  </div>
                )}
                {restriccion.parametros.salaProhibida && (
                  <div>
                    <strong>Sala Prohibida:</strong> {restriccion.parametros.salaProhibida}
                  </div>
                )}
                {restriccion.parametros.especialidadRequerida && (
                  <div>
                    <strong>Especialidad Requerida:</strong> {restriccion.parametros.especialidadRequerida}
                  </div>
                )}
                {restriccion.parametros.diaRestriccion && (
                  <div>
                    <strong>Día:</strong> {restriccion.parametros.diaRestriccion}
                  </div>
                )}
                {restriccion.parametros.horaInicioRestriccion && restriccion.parametros.horaFinRestriccion && (
                  <div>
                    <strong>Horario:</strong> {restriccion.parametros.horaInicioRestriccion} - {restriccion.parametros.horaFinRestriccion}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground border-t pt-2">
                Creado el {restriccion.fechaCreacion} por {restriccion.creadoPor}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {restriccionesFiltradas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">No se encontraron restricciones</h3>
            <p className="text-muted-foreground">
              {busqueda || filtroTipo !== "todos" || filtroPrioridad !== "todos" || filtroActiva !== "todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primera restricción académica"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}