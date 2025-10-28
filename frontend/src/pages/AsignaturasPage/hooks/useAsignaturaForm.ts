import { useEffect, useState } from 'react';
import { asignaturaService } from '@/application/services/AsignaturaService';

export function useAsignaturaForm(asignaturaId?: number) {
    const [form, setForm] = useState({
        codigo: '',
        nombre: '',
        creditos: '',
        anio: new Date().getFullYear().toString(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setForm({
            codigo: '',
            nombre: '',
            creditos: '',
            anio: new Date().getFullYear().toString(),
        });
    };

    useEffect(() => {
        if (!asignaturaId) return resetForm();

        const load = async () => {
            setLoading(true);
            try {
                const data = await asignaturaService.obtenerPorId(asignaturaId);
                if (data) {
                    setForm({
                        codigo: data.codigo,
                        nombre: data.nombre,
                        creditos: data.creditos.toString(),
                        anio: data.semestre.toString(),
                    });
                }
            } catch {
                setError('No se pudo cargar la asignatura');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [asignaturaId]);

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const dto = {
                codigo: form.codigo,
                nombre: form.nombre,
                creditos: Number(form.creditos),
                semestre: Number(form.anio),
            };

            if (asignaturaId) {
                return await asignaturaService.actualizar(asignaturaId, dto);
            } else {
                return await asignaturaService.crearNueva(dto);
            }
        } catch {
            setError('Error al guardar la asignatura');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const isFormValid =
        form.codigo.trim() !== '' &&
        form.nombre.trim() !== '' &&
        form.creditos.trim() !== '' &&
        form.anio.trim() !== '';

    return { form, handleChange, handleSubmit, resetForm, isFormValid, loading, error };
}
