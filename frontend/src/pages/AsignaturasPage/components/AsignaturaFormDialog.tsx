import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog';
import { Plus, Pencil, Check, X, BookOpen } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Badge } from '@components/ui/badge';
import { Card } from '@components/ui/card';

import { useAsignaturaForm } from '../hooks/useAsignaturaForm';
import { useSecciones } from '../hooks/useSecciones';
import type { AsignaturaFormDialogProps } from '../types';
import type { Seccion } from '@/domain/entities/Seccion';

export function AsignaturaFormDialog({
    open,
    onOpenChange,
    onSubmit,
    asignaturaId: propAsignaturaId,
}: AsignaturaFormDialogProps) {
    const [asignaturaId, setAsignaturaId] = useState<number | undefined>(propAsignaturaId);

    const {
        form,
        handleChange,
        handleSubmit: submitAsignatura,
        isFormValid,
        loading: loadingForm,
        resetForm,
    } = useAsignaturaForm(propAsignaturaId);

    const { secciones, actualizarSeccion, eliminarSeccion, resetSecciones } = useSecciones(propAsignaturaId);

    useEffect(() => {
        if (!open) {
            setEditandoId(null);
            setTempSeccion({});
            resetForm();
            resetSecciones?.(); // si tu hook tiene reset
        }
    }, [open]);

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [tempSeccion, setTempSeccion] = useState<Partial<Seccion>>({});

    // Reset cuando se abre o cierra el modal
    useEffect(() => {
        if (!open) {
            setAsignaturaId(propAsignaturaId);
            setEditandoId(null);
            setTempSeccion({});
            resetForm();
            resetSecciones();
        }
    }, [open, propAsignaturaId]);

    const handleGuardarFormulario = async () => {
        const result = await submitAsignatura();
        if (!result) return;

        // Solo llamamos onSubmit con el resultado y las secciones actuales
        onSubmit(result, secciones);
        onOpenChange(false);
    };

    const handleAgregarSeccion = () => {
        if (!asignaturaId) return; // Solo si ya existe asignatura
        const newId = Math.max(0, ...secciones.map((s) => s.id)) + 1;
        const nueva = { id: newId, asignatura_id: asignaturaId, semestre: 1, cupos: 0 };
        setEditandoId(newId);
        setTempSeccion(nueva);
        secciones.push(nueva); // se refleja localmente
    };

    const handleEditarClick = (s: (typeof secciones)[0]) => {
        setEditandoId(s.id);
        setTempSeccion({ ...s });
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setTempSeccion({});
    };

    const handleGuardarEdicion = async (id: number) => {
        if (!tempSeccion) return;
        await actualizarSeccion(id, tempSeccion);
        setEditandoId(null);
        setTempSeccion({});
    };

    const handleEliminarSeccion = async (id: number) => {
        await eliminarSeccion(id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-lg'>
                <DialogHeader>
                    <DialogTitle>{asignaturaId ? 'Editar Asignatura' : 'Nueva Asignatura'}</DialogTitle>
                </DialogHeader>

                <div className='space-y-4'>
                    {/* Campos básicos siempre visibles */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label>Nombre</Label>
                            <Input value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
                        </div>
                        <div className='space-y-2'>
                            <Label>Código</Label>
                            <Input value={form.codigo} onChange={(e) => handleChange('codigo', e.target.value)} />
                        </div>
                        <div className='space-y-2'>
                            <Label>Créditos</Label>
                            <Input
                                type='number'
                                value={form.creditos}
                                onChange={(e) => handleChange('creditos', e.target.value)}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Año</Label>
                            <Input
                                type='number'
                                value={form.anio}
                                onChange={(e) => handleChange('anio', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Secciones solo si existe ID */}
                    {asignaturaId && (
                        <div>
                            <div className='flex justify-between items-center mb-2'>
                                <Label>Secciones</Label>
                                <Button size='sm' variant='ghost' onClick={handleAgregarSeccion}>
                                    <Plus className='w-4 h-4 mr-1' /> Nueva
                                </Button>
                            </div>

                            {secciones.length > 0 ? (
                                <div className='space-y-2'>
                                    {secciones.map((s) => {
                                        const isEditing = editandoId === s.id;
                                        return (
                                            <Card key={s.id} className='p-3 flex justify-between items-center'>
                                                {isEditing ? (
                                                    <div className='flex gap-4 items-center w-full justify-between'>
                                                        <div className='flex gap-3 items-center'>
                                                            <BookOpen className='w-4 h-4 text-muted-foreground' />
                                                            <span>Sección #{s.id}</span>

                                                            <div className='flex gap-2'>
                                                                <div className='flex flex-col'>
                                                                    <Label className='text-xs'>Semestre</Label>
                                                                    <Input
                                                                        type='number'
                                                                        value={tempSeccion.semestre ?? ''}
                                                                        onChange={(e) =>
                                                                            setTempSeccion((prev) => ({
                                                                                ...prev,
                                                                                semestre: Number(e.target.value),
                                                                            }))
                                                                        }
                                                                        className='w-20 h-8'
                                                                    />
                                                                </div>
                                                                <div className='flex flex-col'>
                                                                    <Label className='text-xs'>Cupos</Label>
                                                                    <Input
                                                                        type='number'
                                                                        value={tempSeccion.cupos ?? ''}
                                                                        onChange={(e) =>
                                                                            setTempSeccion((prev) => ({
                                                                                ...prev,
                                                                                cupos: Number(e.target.value),
                                                                            }))
                                                                        }
                                                                        className='w-20 h-8'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='flex gap-2'>
                                                            <Button
                                                                size='icon'
                                                                variant='secondary'
                                                                onClick={() => handleGuardarEdicion(s.id)}
                                                            >
                                                                <Check className='w-4 h-4' />
                                                            </Button>
                                                            <Button
                                                                size='icon'
                                                                variant='ghost'
                                                                onClick={handleCancelarEdicion}
                                                            >
                                                                <X className='w-4 h-4' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='flex gap-3 items-center justify-between w-full'>
                                                        <div className='flex gap-2 items-center'>
                                                            <BookOpen className='w-4 h-4 text-muted-foreground' />
                                                            <span>Sección #{s.id}</span>
                                                            <Badge variant='outline'>Sem {s.semestre}</Badge>
                                                            <Badge variant='outline'>{s.cupos} cupos</Badge>
                                                        </div>
                                                        <div className='flex gap-2'>
                                                            <Button
                                                                size='icon'
                                                                variant='ghost'
                                                                onClick={() => handleEditarClick(s)}
                                                            >
                                                                <Pencil className='w-4 h-4' />
                                                            </Button>
                                                            <Button
                                                                size='icon'
                                                                variant='ghost'
                                                                onClick={() => handleEliminarSeccion(s.id)}
                                                            >
                                                                <X className='w-4 h-4 text-destructive' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className='text-sm text-muted-foreground'>Sin secciones</p>
                            )}
                        </div>
                    )}
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleGuardarFormulario} disabled={!isFormValid || loadingForm}>
                        {asignaturaId ? 'Actualizar' : 'Agregar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
