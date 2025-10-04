import { useState } from 'react';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';

import type { Asignatura } from './types';
import { AsignaturaCard } from './components/AsignaturaCard';
import { AsignaturaFormDialog } from './components/AsignaturaFormDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';

import { asignaturasMock } from '@data/asignaturas';

export function AsignaturasPage() {
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>(asignaturasMock);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAsignaturaId, setSelectedAsignaturaId] = useState<number | undefined>(undefined);

    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedEliminarId, setSelectedEliminarId] = useState<number | undefined>(undefined);

    const handleAgregar = () => {
        setSelectedAsignaturaId(undefined);
        setDialogOpen(true);
    };

    const handleEditar = (id: number) => {
        setSelectedAsignaturaId(id);
        setDialogOpen(true);
    };

    const handleEliminarClick = (id: number) => {
        setSelectedEliminarId(id);
        setAlertOpen(true);
    };

    const handleEliminarConfirm = () => {
        if (selectedEliminarId !== undefined) {
            setAsignaturas((prev) => prev.filter((a) => a.id !== selectedEliminarId));
            toast.success('Asignatura eliminada');
            setSelectedEliminarId(undefined);
            setAlertOpen(false);
        }
    };

    const handleSubmit = (data: Omit<Asignatura, 'id'>) => {
        if (selectedAsignaturaId) {
            setAsignaturas((prev) => prev.map((a) => (a.id === selectedAsignaturaId ? { ...a, ...data } : a)));
            toast.success('Asignatura actualizada');
        } else {
            const newId = Math.max(...asignaturas.map((a) => a.id), 0) + 1;
            setAsignaturas((prev) => [...prev, { id: newId, ...data }]);
            toast.success('Asignatura agregada');
        }
        setDialogOpen(false);
    };

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-3xl'>Gestión de Asignaturas</h2>
                    <p className='text-muted-foreground'>Administra las asignaturas y sus secciones</p>
                </div>
                <Button onClick={handleAgregar}>
                    <Plus className='w-4 h-4 mr-2' />
                    Nueva Asignatura
                </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {asignaturas.length > 0 ? (
                    asignaturas.map((asig) => (
                        <AsignaturaCard
                            key={asig.id}
                            asignatura={asig}
                            onEditar={() => handleEditar(asig.id)}
                            onEliminar={() => handleEliminarClick(asig.id)}
                        />
                    ))
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

            <AsignaturaFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                asignaturaId={selectedAsignaturaId}
            />

            <ConfirmDialog
                open={alertOpen}
                onOpenChange={setAlertOpen}
                onConfirm={handleEliminarConfirm}
                title='Eliminar Asignatura'
                description={`¿Estás seguro de que deseas eliminar la asignatura "${
                    asignaturas.find((a) => a.id === selectedEliminarId)?.codigo ?? ''
                }"? Esta acción no se puede deshacer.`}
                confirmText='Eliminar'
                variant='destructive'
            />
        </div>
    );
}
