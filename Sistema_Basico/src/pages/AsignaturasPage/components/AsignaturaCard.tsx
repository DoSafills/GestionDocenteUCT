import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Edit, Trash2, User, MapPin, Clock } from 'lucide-react';

import type { Asignatura, Docente, Sala, Seccion, Clase, Bloque } from '@/types';

interface Props {
    asignatura: Asignatura;
    secciones: Seccion[];
    clases: Clase[];
    docentes: Docente[];
    salas: Sala[];
    bloques: Bloque[];
    onEditar: () => void;
    onEliminar: () => void;
}

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function AsignaturaCard({
    asignatura,
    secciones,
    clases,
    docentes,
    salas,
    bloques,
    onEditar,
    onEliminar,
}: Props) {
    return (
        <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader className='flex flex-row justify-between items-start'>
                <div>
                    <CardTitle>{asignatura.codigo}</CardTitle>
                    <p className='text-muted-foreground'>{asignatura.nombre}</p>
                    <div className='flex gap-2 mt-2'>
                        <Badge variant='outline'>{asignatura.creditos} créditos</Badge>
                        <Badge variant='secondary'>Sem {asignatura.semestre}</Badge>
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
                        const clasesSeccion = clases.filter((c) => c.seccion_id === seccion.id);
                        return (
                            <div key={seccion.id} className='border rounded-md p-3 space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <span className='font-medium'>
                                        {seccion.codigo} ({seccion.cupos} cupos)
                                    </span>
                                    <Badge variant='outline'>
                                        {seccion.anio}-{seccion.semestre}
                                    </Badge>
                                </div>

                                {clasesSeccion.map((clase) => {
                                    const docente = docentes.find((d) => d.id === clase.docente_id);
                                    const sala = salas.find((s) => s.id === clase.sala_id);
                                    const bloque = bloques.find((b) => b.id === clase.bloque_id);

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
