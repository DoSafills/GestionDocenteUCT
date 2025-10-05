import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog';
import { Plus, Pencil, Check, X, BookOpen } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Badge } from '@components/ui/badge';
import { Card } from '@components/ui/card';
import type { Asignatura, Seccion } from '../types';
import { seccionesMock } from '@/data/secciones';
import { asignaturasMock } from '@/data/asignaturas';

interface Props {
    open: boolean;
    asignaturaId?: number;
    onOpenChange: (v: boolean) => void;
    onSubmit: (data: Omit<Asignatura, 'id'>, secciones: Omit<Seccion, 'id' | 'asignatura_id'>[]) => void;
}

export function AsignaturaFormDialog({ open, onOpenChange, onSubmit, asignaturaId }: Props) {
    const asignatura = asignaturaId ? asignaturasMock.find((a) => a.id === asignaturaId) : undefined;

    const [form, setForm] = useState({
        codigo: '',
        nombre: '',
        creditos: '',
        anio: new Date().getFullYear().toString(), // ← Año por defecto
    });

    const [secciones, setSecciones] = useState<Seccion[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [tempSeccion, setTempSeccion] = useState<Partial<Seccion>>({});

    useEffect(() => {
        if (asignatura) {
            setForm({
                codigo: asignatura.codigo,
                nombre: asignatura.nombre,
                creditos: asignatura.creditos.toString(),
                anio: asignatura.semestre.toString(),
            });
            setSecciones(seccionesMock.filter((s) => s.asignatura_id === asignatura.id));
        } else {
            setForm({
                codigo: '',
                nombre: '',
                creditos: '',
                anio: new Date().getFullYear().toString(),
            });
            setSecciones([]);
        }
    }, [asignatura]);

    const handleAgregarSeccion = () => {
        const newId = Math.max(0, ...secciones.map((s) => s.id)) + 1;
        const nueva = { id: newId, asignatura_id: asignaturaId || 0, semestre: 1, cupos: 0 };
        setSecciones((prev) => [...prev, nueva]);
        setEditandoId(newId);
        setTempSeccion(nueva);
    };

    const handleEliminarSeccion = (id: number) => {
        setSecciones((prev) => prev.filter((s) => s.id !== id));
    };

    const handleEditarClick = (s: Seccion) => {
        setEditandoId(s.id);
        setTempSeccion({ ...s });
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setTempSeccion({});
    };

    const handleGuardarEdicion = (id: number) => {
        setSecciones((prev) => prev.map((s) => (s.id === id ? { ...s, ...tempSeccion } : s)));
        setEditandoId(null);
        setTempSeccion({});
    };

    const handleSubmit = () => {
        if (!form.codigo || !form.nombre || !form.creditos || !form.anio) return;

        onSubmit(
            {
                codigo: form.codigo,
                nombre: form.nombre,
                creditos: Number(form.creditos),
                semestre: Number(form.anio),
            },
            secciones.map(({ id, asignatura_id, ...rest }) => rest),
        );
        onOpenChange(false);
    };

    const isFormValid =
        form.codigo.trim() !== '' &&
        form.nombre.trim() !== '' &&
        form.creditos.trim() !== '' &&
        form.anio.trim() !== '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-lg'>
                <DialogHeader>
                    <DialogTitle>{asignatura ? 'Editar Asignatura' : 'Nueva Asignatura'}</DialogTitle>
                </DialogHeader>

                <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label>Nombre</Label>
                            <Input
                                placeholder='Ej: Álgebra Lineal'
                                type='text'
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Código</Label>
                            <Input
                                placeholder='Ej: MAT101'
                                value={form.codigo}
                                onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Créditos</Label>
                            <Input
                                type='number'
                                placeholder='Ej: 5'
                                value={form.creditos}
                                onChange={(e) => setForm((f) => ({ ...f, creditos: e.target.value }))}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Año</Label>
                            <Input
                                type='number'
                                value={form.anio}
                                onChange={(e) => setForm((f) => ({ ...f, anio: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='flex justify-between items-center mb-2'>
                            <Label>Secciones</Label>
                            <Button
                                size='sm'
                                variant='ghost'
                                onClick={handleAgregarSeccion}
                                disabled={!isFormValid}
                                className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                <Plus className='w-4 h-4 mr-1' /> Nueva
                            </Button>
                        </div>

                        {secciones.length > 0 ? (
                            <div className='space-y-2'>
                                {secciones.map((s) => {
                                    const isEditing = editandoId === s.id;
                                    return (
                                        <Card
                                            key={s.id}
                                            className='p-3 border rounded-md flex items-center justify-between transition-colors'
                                        >
                                            {isEditing ? (
                                                <div className='flex w-full items-center justify-between'>
                                                    <div className='flex items-center gap-4'>
                                                        <BookOpen className='w-4 h-4 text-muted-foreground' />
                                                        <span className='font-medium text-sm text-muted-foreground'>
                                                            Sección #{s.id}
                                                        </span>

                                                        <div className='flex items-center gap-3'>
                                                            <div className='flex items-center gap-2'>
                                                                <Label className='text-xs text-muted-foreground'>
                                                                    Semestre
                                                                </Label>
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
                                                            <div className='flex items-center gap-2'>
                                                                <Label className='text-xs text-muted-foreground'>
                                                                    Cupos
                                                                </Label>
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

                                                    <div className='flex items-center gap-2'>
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
                                                <div className='flex w-full items-center justify-between'>
                                                    <div className='flex items-center gap-3'>
                                                        <BookOpen className='w-4 h-4 text-muted-foreground' />
                                                        <span className='font-medium'>Sección #{s.id}</span>
                                                        <Badge variant='outline'>Semestre {s.semestre}</Badge>
                                                        <Badge variant='outline'>{s.cupos} cupos</Badge>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
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
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={!isFormValid}>
                        {asignatura ? 'Actualizar' : 'Agregar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
