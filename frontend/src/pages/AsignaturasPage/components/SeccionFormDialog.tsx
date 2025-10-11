import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import type { Seccion, Asignatura } from '../types';

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSubmit: (data: Omit<Seccion, 'id' | 'asignatura_id'>) => void;
    asignatura: Asignatura;
    seccion?: Seccion;
}

export function SeccionFormDialog({ open, onOpenChange, onSubmit, asignatura, seccion }: Props) {
    const [form, setForm] = useState({
        anio: new Date().getFullYear(),
        semestre: 1,
        cupos: 30,
    });

    useEffect(() => {
        if (seccion) {
            setForm({
                anio: seccion.anio,
                semestre: seccion.semestre,
                cupos: seccion.cupos,
            });
        } else {
            setForm({
                anio: new Date().getFullYear(),
                semestre: 1,
                cupos: 30,
            });
        }
    }, [seccion]);

    const handleSubmit = () => {
        onSubmit({
            anio: Number(form.anio),
            semestre: Number(form.semestre),
            cupos: Number(form.cupos),
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{seccion ? 'Editar Sección' : 'Nueva Sección'}</DialogTitle>
                </DialogHeader>

                <div className='flex gap-2'>
                    <div className='flex-1 space-y-2'>
                        <Label>Código Asignatura</Label>
                        <Input
                            placeholder={asignatura.codigo}
                            disabled
                            className='cursor-not-allowed text-muted-foreground'
                        />
                    </div>
                    <div className='flex-1 space-y-2'>
                        <Label>Nombre Asignatura</Label>
                        <Input
                            placeholder={asignatura.nombre}
                            disabled
                            className='cursor-not-allowed text-muted-foreground'
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    <div className='flex-1 space-y-2'>
                        <Label>Año</Label>
                        <Input
                            type='number'
                            value={form.anio}
                            onChange={(e) => setForm((f) => ({ ...f, anio: Number(e.target.value) }))}
                        />
                    </div>
                    <div className='flex-1 space-y-2'>
                        <Label>Semestre</Label>
                        <Input
                            type='number'
                            value={form.semestre}
                            min={0}
                            onChange={(e) => setForm((f) => ({ ...f, semestre: Number(e.target.value) }))}
                        />
                    </div>
                    <div className='flex-1 space-y-2'>
                        <Label>Cupos</Label>
                        <Input
                            type='number'
                            value={form.cupos}
                            onChange={(e) => setForm((f) => ({ ...f, cupos: Number(e.target.value) }))}
                        />
                    </div>
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>{seccion ? 'Actualizar' : 'Agregar'}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
