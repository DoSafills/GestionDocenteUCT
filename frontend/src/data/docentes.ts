import type { Docente } from '@/types';

export const docentesMock: Docente[] = [
    {
        id: 201,
        nombre: 'Ana Pérez',
        email: 'ana.perez@universidad.edu',
        password_hash: 'hash123',
        esta_activo: true,
        especialidad: 'Matemáticas',
    },
    {
        id: 202,
        nombre: 'Luis García',
        email: 'luis.garcia@universidad.edu',
        password_hash: 'hash456',
        esta_activo: true,
        especialidad: 'Física',
    },
    {
        id: 203,
        nombre: 'María López',
        email: 'maria.lopez@universidad.edu',
        password_hash: 'hash789',
        esta_activo: false,
        especialidad: 'Historia',
    },
    {
        id: 204,
        nombre: 'Carlos Sánchez',
        email: 'carlos.sanchez@universidad.edu',
        password_hash: 'hashABC',
        esta_activo: true,
        especialidad: 'Lengua y Literatura',
    },
    {
        id: 205,
        nombre: 'Elena Torres',
        email: 'elena.torres@universidad.edu',
        password_hash: 'hashDEF',
        esta_activo: true,
        especialidad: 'Biología',
    },
    {
        id: 210,
        nombre: 'José Martínez',
        email: 'jose.martinez@universidad.edu',
        password_hash: 'hashXYZ',
        esta_activo: false,
        especialidad: 'Química',
    },
];
