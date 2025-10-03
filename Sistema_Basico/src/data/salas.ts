import type { Sala } from '@/types';

export const salasMock: Sala[] = [
    {
        id: 101,
        codigo: 'A-101',
        capacidad: 40,
        tipo: 'Aula',
        esta_disponible: true,
        edificio_id: 1,
        equipamiento: 'Pizarra, Proyector',
    },
    {
        id: 102,
        codigo: 'LAB-202',
        capacidad: 30,
        tipo: 'Laboratorio',
        esta_disponible: true,
        edificio_id: 2,
        equipamiento: 'Computadoras, Proyector',
    },
    {
        id: 103,
        codigo: 'AUD-1',
        capacidad: 100,
        tipo: 'Auditorio',
        esta_disponible: false,
        edificio_id: 3,
        equipamiento: 'Sonido, Micrófonos, Pantalla gigante',
    },
];
