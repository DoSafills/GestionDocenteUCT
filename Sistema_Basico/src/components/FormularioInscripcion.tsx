import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { Curso, Inscripcion, ValidacionResult } from "../types";
import { validarInscripcion } from "../utils/validaciones";
import { cursosCompletadosEjemplo } from "../data/cursos";
import { RestriccionesInfo } from "./RestriccionesInfo";

interface FormularioInscripcionProps {
  curso: Curso | null;
  abierto: boolean;
  onCerrar: () => void;
  onInscripcion: (inscripcion: Inscripcion) => void;
}

export function FormularioInscripcion({ curso, abierto, onCerrar, onInscripcion }: FormularioInscripcionProps) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    edad: '',
    nivel: '' as 'Principiante' | 'Intermedio' | 'Avanzado' | '',
    comentarios: ''
  });

  const [validacion, setValidacion] = useState<ValidacionResult | null>(null);
  const [mostrarValidacion, setMostrarValidacion] = useState(false);

  const handleInputChange = (campo: string, valor: string) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }));
    setMostrarValidacion(false);
  };

  const validarFormulario = () => {
    if (!curso) return;

    const inscripcion: Inscripcion = {
      cursoId: curso.id,
      estudiante: {
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        email: formulario.email,
        telefono: formulario.telefono,
        edad: parseInt(formulario.edad) || 0,
        cursosCompletados: cursosCompletadosEjemplo,
        nivel: formulario.nivel as 'Principiante' | 'Intermedio' | 'Avanzado'
      },
      fecha: new Date().toISOString()
    };

    const resultado = validarInscripcion(curso, inscripcion);
    setValidacion(resultado);
    setMostrarValidacion(true);

    if (resultado.esValida) {
      // Si la validación es exitosa, proceder con la inscripción
      onInscripcion(inscripcion);
      resetFormulario();
      onCerrar();
    }
  };

  const resetFormulario = () => {
    setFormulario({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      edad: '',
      nivel: '',
      comentarios: ''
    });
    setValidacion(null);
    setMostrarValidacion(false);
  };

  const evaluarRestricciones = () => {
    if (!curso || !formulario.edad || !formulario.nivel) return {};

    const edad = parseInt(formulario.edad);
    return {
      edad: (!curso.restricciones.edadMinima || edad >= curso.restricciones.edadMinima) &&
            (!curso.restricciones.edadMaxima || edad <= curso.restricciones.edadMaxima),
      prerrequisitos: !curso.restricciones.prerrequisitos || 
                     curso.restricciones.prerrequisitos.every(prereq => 
                       cursosCompletadosEjemplo.includes(prereq)
                     ),
      nivel: !curso.restricciones.nivelMinimo || 
             (() => {
               const niveles = { 'Principiante': 1, 'Intermedio': 2, 'Avanzado': 3 };
               return niveles[formulario.nivel as keyof typeof niveles] >= 
                      niveles[curso.restricciones.nivelMinimo as keyof typeof niveles];
             })()
    };
  };

  if (!curso) return null;

  const formularioCompleto = formulario.nombre && formulario.apellido && 
                            formulario.email && formulario.telefono && 
                            formulario.edad && formulario.nivel;

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inscripción: {curso.nombre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del curso */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="mb-2">Detalles del curso</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Instructor:</strong> {curso.instructor}
              </div>
              <div>
                <strong>Duración:</strong> {curso.duracion}
              </div>
              <div>
                <strong>Precio:</strong> ${curso.precio}
              </div>
              <div>
                <strong>Cupos disponibles:</strong> {curso.cuposDisponibles}
              </div>
            </div>
          </div>

          {/* Restricciones del curso */}
          <RestriccionesInfo 
            restricciones={curso.restricciones} 
            cumplidas={evaluarRestricciones()}
          />

          {/* Formulario de datos personales */}
          <div className="space-y-4">
            <h4>Datos personales</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formulario.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={formulario.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  placeholder="Tu apellido"
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formulario.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edad">Edad *</Label>
                <Input
                  id="edad"
                  type="number"
                  min="16"
                  max="100"
                  value={formulario.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel actual *</Label>
                <Select value={formulario.nivel} onValueChange={(value) => handleInputChange('nivel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900">
                    <SelectItem value="Principiante">Principiante</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentarios">Comentarios adicionales</Label>
              <Textarea
                id="comentarios"
                value={formulario.comentarios}
                onChange={(e) => handleInputChange('comentarios', e.target.value)}
                placeholder="¿Hay algo más que deberíamos saber?"
                rows={3}
              />
            </div>

            {/* Cursos completados (simulado) */}
            <div className="space-y-2">
              <Label>Cursos completados previamente</Label>
              <div className="flex flex-wrap gap-2">
                {cursosCompletadosEjemplo.map((curso, index) => (
                  <Badge key={index} variant="secondary">
                    {curso}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                * Esta información se obtendría de tu historial académico
              </p>
            </div>
          </div>

          {/* Resultados de validación */}
          {mostrarValidacion && validacion && (
            <div className="space-y-3">
              {validacion.errores.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="text-red-800">No puedes inscribirte por los siguientes motivos:</p>
                      <ul className="list-disc list-inside text-sm text-red-700">
                        {validacion.errores.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {validacion.advertencias.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="text-yellow-800">Advertencias:</p>
                      <ul className="list-disc list-inside text-sm text-yellow-700">
                        {validacion.advertencias.map((advertencia, index) => (
                          <li key={index}>{advertencia}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {validacion.esValida && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ¡Excelente! Cumples todos los requisitos para inscribirte en este curso.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button 
              onClick={validarFormulario}
              disabled={!formularioCompleto}
            >
              Validar e Inscribirse
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}