import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Edit, Trash2, User, MapPin, Clock, BookOpen } from 'lucide-react';

import type { Asignatura } from '../types';
import { seccionesMock } from '@/data/secciones';
import { clasesMock } from '@/data/clases';
import { docentesMock } from '@/data/docentes';
import { salasMock } from '@/data/salas';
import { bloquesMock } from '@/data/bloques';

const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

export function AsignaturaCard({
    asignatura,
    onEditar,
    onEliminar,
}: {
    asignatura: Asignatura;
    onEditar: () => void;
    onEliminar: () => void;
}) {
    // Obtener secciones de la asignatura
    const secciones = seccionesMock.filter((s) => s.asignatura_id === asignatura.id);

    return (
        <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader className='flex justify-between items-start'>
                <div>
                    <CardTitle className='flex items-center gap-2'>
                        <BookOpen className='w-5 h-5 text-primary' />
                        {asignatura.codigo}
                    </CardTitle>
                    <p className='text-muted-foreground'>{asignatura.nombre}</p>
                    <div className='flex gap-2 mt-2'>
                        <Badge variant='outline'>{asignatura.creditos} créditos</Badge>
                        <Badge variant='outline'>Sem {asignatura.semestre}</Badge>
                    </div>
                </div>

                <div className='flex gap-1'>
                    <Button variant='ghost' size='sm' onClick={onEditar}>
                        <Edit className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='sm' onClick={onEliminar}>
                        <Trash2 className='w-4 h-4 text-destructive' />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className='space-y-4'>
                {secciones.length > 0 ? (
                    secciones.map((seccion) => {
                        const clasesSeccion = clasesMock.filter((c) => c.seccion_id === seccion.id);

                        return (
                            <div key={seccion.id} className='border rounded-md p-3 space-y-2'>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>
                                        {seccion.codigo} ({seccion.cupos} cupos)
                                    </span>
                                    <Badge variant='outline'>
                                        {seccion.anio}-{seccion.semestre}
                                    </Badge>
                                </div>

                                {clasesSeccion.map((clase) => {
                                    const docente = docentesMock.find((d) => d.id === clase.docente_id);
                                    const sala = salasMock.find((s) => s.id === clase.sala_id);
                                    const bloque = bloquesMock.find((b) => b.id === clase.bloque_id);

                                    return (
                                        <div
                                            key={clase.id}
                                            className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-t pt-2 text-sm'
                                        >
                                            <div className='flex items-center gap-2'>
                                                <User className='w-4 h-4 text-muted-foreground' />
                                                {docente ? docente.nombre : 'Sin docente'}
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <MapPin className='w-4 h-4 text-muted-foreground' />
                                                {sala ? sala.codigo : 'Sin sala'}
                                            </div>
                                            {bloque && (
                                                <div className='flex items-center gap-2'>
                                                    <Clock className='w-4 h-4 text-muted-foreground' />
                                                    {`${diasSemana[bloque.dia_semana - 1]} ${bloque.hora_inicio} - ${bloque.hora_fin}`}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                ) : (
                    <p className='text-sm text-muted-foreground'>Sin secciones</p>
                )}
            </CardContent>
        </Card>
    );
}
