import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { DIAS_SEMANA, ESTADOS_HORARIO, COLORES_HORARIO } from "../constants";
import type { FormularioHorarioProps } from "../types/componentes";

export function FormularioHorario({
  formulario,
  onFormularioChange,
  onSubmit,
  onCancelar,
  profesores,
  asignaturas,
  salas,
  errores = {}
}: FormularioHorarioProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Debug logs
  console.log('FormularioHorario renderizado');
  console.log('Salas recibidas:', salas?.length || 0);
  console.log('Profesores recibidos:', profesores?.length || 0);
  console.log('Asignaturas recibidas:', asignaturas?.length || 0);

  // Verificar que tenemos datos para mostrar en el formulario
  if (!salas || salas.length === 0) {
    console.log('No hay salas - mostrando mensaje');
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-lg font-semibold mb-2">No hay salas disponibles</p>
          <p className="text-muted-foreground">
            No se encontraron salas para crear horarios.
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log('Formulario renderizando normalmente');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulario de Horario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formulario.titulo}
                  onChange={(e) => onFormularioChange('titulo', e.target.value)}
                  className={errores.titulo ? 'border-red-500' : ''}
                />
                {errores.titulo && (
                  <p className="text-sm text-red-500">{errores.titulo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formulario.estado}
                  onValueChange={(value: any) => onFormularioChange('estado', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_HORARIO.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formulario.descripcion}
                onChange={(e) => onFormularioChange('descripcion', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Horario */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Horario</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dia">Día *</Label>
                <Select
                  value={formulario.dia}
                  onValueChange={(value) => onFormularioChange('dia', value)}
                >
                  <SelectTrigger className={errores.dia ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar día" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIAS_SEMANA.map((dia) => (
                      <SelectItem key={dia.id} value={dia.id}>
                        {dia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.dia && (
                  <p className="text-sm text-red-500">{errores.dia}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaInicio">Hora Inicio *</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={formulario.horaInicio}
                  onChange={(e) => onFormularioChange('horaInicio', e.target.value)}
                  className={errores.horaInicio ? 'border-red-500' : ''}
                />
                {errores.horaInicio && (
                  <p className="text-sm text-red-500">{errores.horaInicio}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaFin">Hora Fin *</Label>
                <Input
                  id="horaFin"
                  type="time"
                  value={formulario.horaFin}
                  onChange={(e) => onFormularioChange('horaFin', e.target.value)}
                  className={errores.horaFin ? 'border-red-500' : ''}
                />
                {errores.horaFin && (
                  <p className="text-sm text-red-500">{errores.horaFin}</p>
                )}
              </div>
            </div>
          </div>

          {/* Asignaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Asignaciones</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sala">Sala *</Label>
                <Select
                  value={formulario.salaId}
                  onValueChange={(value) => onFormularioChange('salaId', value)}
                >
                  <SelectTrigger className={errores.salaId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {salas.map((sala) => (
                      <SelectItem key={sala.id} value={sala.id}>
                        {sala.numero} - {sala.edificio?.nombre || 'Edificio'} (Cap: {sala.capacidad})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.salaId && (
                  <p className="text-sm text-red-500">{errores.salaId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profesor">Profesor</Label>
                <Select
                  value={formulario.profesorId}
                  onValueChange={(value) => onFormularioChange('profesorId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {profesores.map((profesor: any) => (
                      <SelectItem key={profesor.id} value={profesor.id}>
                        {profesor.nombre} {profesor.apellido || ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asignatura">Asignatura</Label>
              <Select
                value={formulario.asignaturaId}
                onValueChange={(value) => onFormularioChange('asignaturaId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Relacionar con asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {asignaturas.map((asignatura) => (
                    <SelectItem key={asignatura.id} value={asignatura.id}>
                      {asignatura.codigo} - {asignatura.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Configuraciones adicionales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuraciones</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select
                  value={formulario.color}
                  onValueChange={(value) => onFormularioChange('color', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORES_HORARIO.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurrente"
                    checked={formulario.recurrente}
                    onCheckedChange={(checked) => onFormularioChange('recurrente', checked)}
                  />
                  <Label htmlFor="recurrente">Horario recurrente</Label>
                </div>
              </div>
            </div>

            {formulario.recurrente && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={formulario.fechaInicio}
                    onChange={(e) => onFormularioChange('fechaInicio', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={formulario.fechaFin}
                    onChange={(e) => onFormularioChange('fechaFin', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button type="submit">
              Guardar Horario
            </Button>
            <Button type="button" variant="outline" onClick={onCancelar}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}