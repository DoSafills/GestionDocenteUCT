import { useState } from 'react';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';

import type { Asignatura } from './types';
import { AsignaturaCard } from './components/AsignaturaCard';

import { asignaturasMock } from '@data/asignaturas';
import { seccionesMock } from '@data/secciones';
import { bloquesMock } from '@data/bloques';
import { clasesMock } from '@data/clases';
import { salasMock } from '@data/salas';
import { docentesMock } from '@data/docentes';

export function AsignaturasPage() {
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>(asignaturasMock);

    const handleEliminar = (id: number) => {
        setAsignaturas((prev) => prev.filter((a) => a.id !== id));
        toast.success('Asignatura eliminada');
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-3xl'>Gestión de Asignaturas</h2>
                    <p className='text-muted-foreground'>Administra las asignaturas y sus secciones</p>
                </div>
                <Button onClick={() => {}}>
                    <Plus className='w-4 h-4 mr-2' />
                    Nueva Asignatura
                </Button>
            </div>

            {/* Lista */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {asignaturas.length > 0 ? (
                    asignaturas.map((asig) => {
                        const secciones = seccionesMock.filter((s) => s.asignatura_id === asig.id);
                        return (
                            <AsignaturaCard
                                key={asig.id}
                                asignatura={asig}
                                secciones={secciones}
                                clases={clasesMock}
                                docentes={docentesMock}
                                salas={salasMock}
                                bloques={bloquesMock}
                                onEditar={() => {}}
                                onEliminar={() => handleEliminar(asig.id)}
                            />
                        );
                    })
                ) : (
                    <Card>
                        <CardContent className='text-center py-12'>
                            <BookOpen className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
                            <h3 className='text-lg mb-2'>No hay asignaturas registradas</h3>
                            <p className='text-muted-foreground'>Comienza agregando tu primera asignatura</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Dialog */}
        </div>
    );
}
