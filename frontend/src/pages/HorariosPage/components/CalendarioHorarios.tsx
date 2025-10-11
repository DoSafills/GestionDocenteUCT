import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Calendar, Grid3x3 } from "lucide-react";
import { DIAS_SEMANA } from "../constants";
import { formatearRangoHorario } from "../utils";
import React from 'react';
import type { CalendarioHorariosProps } from "../types/componentes";

interface CalendarioHorariosProps {
	horarios: any[];
	onVerDetalle: (claseId: string) => void;
	vista?: 'semanal' | 'mensual';
	onCambiarVista: (vista: 'semanal' | 'mensual') => void;
}

export function CalendarioHorarios({
  horarios,
  onVerDetalle,
  vista = 'semanal',
  onCambiarVista
}: CalendarioHorariosProps) {

  // Generar horas del día de 7:00 a 20:00
  const horasDelDia = Array.from({ length: 14 }, (_, i) => {
    const hora = (i + 7).toString().padStart(2, '0');
    return `${hora}:00`;
  });

  const diasSemana = DIAS_SEMANA.map(dia => dia.nombre);

  const renderVistaCalendario = () => {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-0 min-w-[1000px] border border-border rounded-lg">
              {/* Header */}
              <div className="bg-muted border-r border-b border-border p-3 flex items-center justify-center font-semibold text-sm">
                Hora
              </div>
              {diasSemana.map((dia) => (
                <div
                  key={dia}
                  className="bg-muted border-r border-b border-border p-3 text-center font-semibold text-sm"
                >
                  {dia}
                </div>
              ))}

              {/* Filas de horarios */}
              {horasDelDia.map((hora) => (
                <React.Fragment key={hora}>
                  {/* Columna de hora */}
                  <div className="bg-muted/30 border-r border-b border-border p-2 text-center text-xs font-medium text-muted-foreground min-h-[80px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-semibold">{hora}</div>
                      <div className="text-xs opacity-75">
                        {parseInt(hora.split(':')[0]) < 12 ? 'AM' : 'PM'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Columnas de días */}
                  {diasSemana.map((dia) => {
                    const horariosEnEsteSlot = horarios.filter((h) => {
                      const horaInicio = parseInt(h.horario.hora_inicio.split(':')[0]);
                      const horaFin = parseInt(h.horario.hora_fin.split(':')[0]);
                      const horaActual = parseInt(hora.split(':')[0]);
                      
                      return h.horario.dia === dia &&
                             horaActual >= horaInicio &&
                             horaActual < horaFin;
                    });

                    return (
                      <div
                        key={`${dia}-${hora}`}
                        className="border-r border-b border-border p-1 min-h-[80px] bg-background relative hover:bg-muted/10 transition-colors"
                      >
                        {horariosEnEsteSlot.map((horario) => {
                          const horaInicio = parseInt(horario.horario.hora_inicio.split(':')[0]);
                          const horaActual = parseInt(hora.split(':')[0]);
                          
                          // Solo mostrar el bloque en la primera hora
                          if (horaInicio === horaActual) {
                            const duracion = parseInt(horario.horario.hora_fin.split(':')[0]) - horaInicio;
                            const alturaBloque = Math.max(duracion * 80 - 8, 72); // 80px por hora menos bordes
                            
                            return (
                              <div
                                key={horario.id}
                                className="absolute inset-1 bg-blue-50 border border-blue-200 rounded-lg p-2 cursor-pointer hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md z-10"
                                style={{
                                  height: `${alturaBloque}px`
                                }}
                                onClick={() => onVerDetalle(horario.clase_id)}
                                title={`${horario.titulo}\n${formatearRangoHorario(horario.horario.hora_inicio, horario.horario.hora_fin)}\nSala: ${horario.sala.numero}\nDocente: ${horario.docente.nombre}`}
                              >
                                <div className="h-full flex flex-col justify-between">
                                  <div>
                                    <div className="font-semibold text-xs text-blue-900 truncate mb-1">
                                      {horario.titulo}
                                    </div>
                                    <div className="text-xs text-blue-700 truncate">
                                      📍 {horario.sala.numero}
                                    </div>
                                    <div className="text-xs text-blue-600 truncate">
                                      👨‍🏫 {horario.docente.nombre.split(' ')[0]}
                                    </div>
                                  </div>
                                  <div className="text-xs text-blue-600 font-medium">
                                    🕒 {formatearRangoHorario(horario.horario.hora_inicio, horario.horario.hora_fin)}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vista de Calendario</h3>
        <div className="flex gap-2">
          <Button
            variant={vista === 'semanal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCambiarVista('semanal')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Semanal
          </Button>
          <Button
            variant={vista === 'mensual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCambiarVista('mensual')}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Mensual
          </Button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
          <span>Horario programado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          <span>Clase activa</span>
        </div>
        <span>💡 Haz clic en un horario para ver más detalles</span>
      </div>

      {/* Vista del calendario */}
      {renderVistaCalendario()}

      {horarios.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No hay horarios para mostrar</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No se encontraron horarios programados para el periodo seleccionado. 
              Puedes agregar nuevos horarios usando el botón "Agregar Horario".
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

