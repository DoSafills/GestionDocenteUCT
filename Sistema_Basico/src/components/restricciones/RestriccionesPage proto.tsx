import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
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
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
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

  const [formulario, setFormulario] = useState({
    tipo: "prerrequisito" as RestriccionAcademica["tipo"],
    descripcion: "",
    prioridadFloat: 0.5, // valor de 0 a 1
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
    const coincidePrioridad = filtroPrioridad === "todos" ||
      prioridadDesdeFloat(restriccion.prioridadFloat) === filtroPrioridad;
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
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(asig => <SelectItem key={asig.id} value={asig.codigo}>{asig.codigo} - {asig.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Asignatura Destino</Label>
              <Select value={formulario.asignaturaDestino} onValueChange={(value) =>
                setFormulario(prev => ({ ...prev, asignaturaDestino: value }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(asig => <SelectItem key={asig.id} value={asig.codigo}>{asig.codigo} - {asig.nombre}</SelectItem>)}
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
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(asig => <SelectItem key={asig.id} value={asig.codigo}>{asig.codigo} - {asig.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Sala Prohibida</Label>
              <Select value={formulario.salaProhibida} onValueChange={(value) =>
                setFormulario(prev => ({ ...prev, salaProhibida: value }))}>
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
            <div className="space-y-2">
              <Label>Asignatura</Label>
              <Select value={formulario.asignaturaOrigen} onValueChange={(value) =>
                setFormulario(prev => ({ ...prev, asignaturaOrigen: value }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  {asignaturasMock.map(asig => <SelectItem key={asig.id} value={asig.codigo}>{asig.codigo} - {asig.nombre}</SelectItem>)}
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
                <SelectTrigger><SelectValue placeholder="Seleccionar día" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los días</SelectItem>
                  {diasSemana.map(dia => <SelectItem key={dia} value={dia}>{dia}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hora Inicio</Label>
              <Input type="time" value={formulario.horaInicioRestriccion} onChange={(e) =>
                setFormulario(prev => ({ ...prev, horaInicioRestriccion: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Hora Fin</Label>
              <Input type="time" value={formulario.horaFinRestriccion} onChange={(e) =>
                setFormulario(prev => ({ ...prev, horaFinRestriccion: e.target.value }))} />
            </div>
          </div>
        );
      default: return null;
    }
  };

  // ... Aquí seguiría toda la parte de renderizado igual que tu código original
  // con los filtros, resumen y lista de restricciones.

  return (
    <div className="space-y-6">
      {/* TODO: incluir aquí todo el código JSX de tu página, igual que antes, usando `restriccionesFiltradas` y `prioridadDesdeFloat` */}
    </div>
  );
}
