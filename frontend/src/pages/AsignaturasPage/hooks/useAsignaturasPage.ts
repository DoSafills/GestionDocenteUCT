// src/hooks/useAsignaturasPage.ts
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { asignaturaService } from '@/infraestructure/services/AsignaturaService';
import type { Asignatura } from '@/domain/entities/Asignatura';
import type { NuevaAsignaturaDTO, ActualizarAsignaturaDTO } from '@/domain/entities/Asignatura/types';

export function useAsignaturasPage() {
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAsignaturaId, setSelectedAsignaturaId] = useState<number | undefined>(undefined);

    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedEliminarId, setSelectedEliminarId] = useState<number | undefined>(undefined);

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // 🔹 Inicialización
    const fetchAsignaturas = async () => {
        try {
            setLoading(true);
            const data = await asignaturaService.obtenerTodas();
            setAsignaturas(data);
        } catch (err) {
            toast.error('Error al cargar asignaturas');
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Acciones CRUD
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

    const handleEliminarConfirm = async () => {
        if (!selectedEliminarId) return;

        try {
            await asignaturaService.eliminar(selectedEliminarId);
            setAsignaturas((prev) => prev.filter((a) => a.id !== selectedEliminarId));
            toast.success('Asignatura eliminada');
        } catch {
            toast.error('Error al eliminar la asignatura');
        } finally {
            setSelectedEliminarId(undefined);
            setAlertOpen(false);
        }
    };

    const handleSubmit = async (data: NuevaAsignaturaDTO | ActualizarAsignaturaDTO) => {
        try {
            if (selectedAsignaturaId) {
                await asignaturaService.actualizar(selectedAsignaturaId, data);
                toast.success('Asignatura actualizada');
            } else {
                await asignaturaService.crearNueva(data as NuevaAsignaturaDTO);
                toast.success('Asignatura agregada');
            }
            await fetchAsignaturas();
        } catch {
            toast.error('Error al guardar la asignatura');
        } finally {
            setDialogOpen(false);
        }
    };

    // 🔎 Búsqueda
    const filteredAsignaturas = useMemo(() => {
        if (!searchQuery) return asignaturas;
        return asignaturas.filter(
            (a) =>
                a.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.codigo.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [asignaturas, searchQuery]);

    return {
        asignaturas,
        filteredAsignaturas,
        loading,
        dialogOpen,
        alertOpen,
        selectedAsignaturaId,
        selectedEliminarId,
        searchQuery,

        // Handlers
        setDialogOpen,
        setAlertOpen,
        setSearchQuery,
        handleAgregar,
        handleEditar,
        handleEliminarClick,
        handleEliminarConfirm,
        handleSubmit,
        fetchAsignaturas,
    };
}
