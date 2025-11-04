// src/hooks/useSecciones.ts
import { useEffect, useState } from 'react';
import type { Seccion } from '@/domain/entities/Seccion';
import { seccionService } from '@/application/services/SeccionService';
import type { NuevaSeccionDTO, ActualizarSeccionDTO } from '@/domain/entities/Seccion/types';

export function useSecciones(asignaturaId?: number) {
    const [secciones, setSecciones] = useState<Seccion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetSecciones = () => setSecciones([]);

    useEffect(() => {
        if (!asignaturaId) return resetSecciones();

        const load = async () => {
            try {
                setLoading(true);
                const data = await seccionService.obtenerPorAsignaturaId(asignaturaId);
                setSecciones(data);
            } catch (err) {
                console.error(err);
                setError('Error al cargar secciones');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [asignaturaId]);

    const agregarSeccion = async (data: NuevaSeccionDTO) => {
        if (!asignaturaId) {
            throw new Error('No se puede agregar seccion: asignaturaId no disponible');
        }
        const nueva = await seccionService.crearNueva({
            ...data,
            asignatura_id: asignaturaId,
        });
        setSecciones((prev) => [...prev, nueva]);
    };

    const actualizarSeccion = async (id: number, data: ActualizarSeccionDTO) => {
        const actualizada = await seccionService.actualizar(id, data);
        setSecciones((prev) => prev.map((s) => (s.id === id ? actualizada : s)));
    };

    const eliminarSeccion = async (id: number) => {
        await seccionService.eliminar(id);
        setSecciones((prev) => prev.filter((s) => s.id !== id));
    };

    return {
        secciones,
        loading,
        error,
        agregarSeccion,
        actualizarSeccion,
        eliminarSeccion,
        resetSecciones,
    };
}
