import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import type { Asignatura } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSubmit: (data: Omit<Asignatura, 'id'>) => void;
    asignatura?: Asignatura;
}

export function AsignaturaFormDialog({ open, onOpenChange, onSubmit, asignatura }: Props) {
    const [form, setForm] = useState({
        codigo: '',
        nombre: '',
        creditos: '',
        semestre: '',
    });

    useEffect(() => {
        if (asignatura) {
            setForm({
                codigo: asignatura.codigo,
                nombre: asignatura.nombre,
                creditos: asignatura.creditos.toString(),
                semestre: asignatura.semestre.toString(),
            });
        } else {
            setForm({ codigo: '', nombre: '', creditos: '', semestre: '' });
        }
    }, [asignatura]);

    const handleSubmit = () => {
        if (!form.codigo || !form.nombre) return;
        onSubmit({
            codigo: form.codigo,
            nombre: form.nombre,
            creditos: parseInt(form.creditos) || 0,
            semestre: parseInt(form.semestre) || 1,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{asignatura ? 'Editar Asignatura' : 'Nueva Asignatura'}</DialogTitle>
                </DialogHeader>

                <div className='space-y-4'>
                    <div>
                        <Label>Código</Label>
                        <Input
                            value={form.codigo}
                            onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
                        />
                    </div>
                    <div>
                        <Label>Nombre</Label>
                        <Input
                            value={form.nombre}
                            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                        />
                    </div>
                    <div>
                        <Label>Créditos</Label>
                        <Input
                            type='number'
                            value={form.creditos}
                            onChange={(e) => setForm((f) => ({ ...f, creditos: e.target.value }))}
                        />
                    </div>
                    <div>
                        <Label>Semestre</Label>
                        <Input
                            type='number'
                            value={form.semestre}
                            onChange={(e) => setForm((f) => ({ ...f, semestre: e.target.value }))}
                        />
                    </div>
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>{asignatura ? 'Actualizar' : 'Agregar'}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
