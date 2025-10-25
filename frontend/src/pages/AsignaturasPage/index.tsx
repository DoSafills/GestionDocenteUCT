import { useEffect } from 'react';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { BookOpen, Plus } from 'lucide-react';

import { AsignaturaCard } from './components/AsignaturaCard';
import { AsignaturaFormDialog } from './components/AsignaturaFormDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SearchBar } from './components/SearchBar';

import { useAsignaturasPage } from './hooks/useAsignaturasPage';

export function AsignaturasPage() {
    const {
        asignaturas,
        filteredAsignaturas,
        loading,
        dialogOpen,
        alertOpen,
        selectedAsignaturaId,
        selectedEliminarId,

        setDialogOpen,
        setAlertOpen,
        setSearchQuery,
        handleAgregar,
        handleEditar,
        handleEliminarClick,
        handleEliminarConfirm,
        handleSubmit,
        fetchAsignaturas,
    } = useAsignaturasPage();

    useEffect(() => {
        fetchAsignaturas();
    }, []);

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

            <Card>
                <CardContent className='p-4'>
                    <SearchBar onSearch={setSearchQuery} />
                </CardContent>
            </Card>

            {loading ? (
                <p className='text-center text-muted-foreground py-12'>Cargando asignaturas...</p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {filteredAsignaturas.length > 0 ? (
                        filteredAsignaturas.map((asig) => (
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
            )}

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
