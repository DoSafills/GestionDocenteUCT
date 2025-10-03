import type { Seccion } from '@/types';

export const seccionesMock: Seccion[] = [
    // MAT101 - Cálculo I
    { id: 1, codigo: 'MAT101-01', anio: 2025, semestre: 1, asignatura_id: 1, cupos: 40 },
    { id: 2, codigo: 'MAT101-02', anio: 2025, semestre: 1, asignatura_id: 1, cupos: 35 },

    // FIS101 - Física I
    { id: 3, codigo: 'FIS101-01', anio: 2025, semestre: 1, asignatura_id: 2, cupos: 30 },
    { id: 4, codigo: 'FIS101-02', anio: 2025, semestre: 1, asignatura_id: 2, cupos: 28 },

    // QUI101 - Química General
    { id: 5, codigo: 'QUI101-01', anio: 2025, semestre: 1, asignatura_id: 3, cupos: 32 },
    { id: 6, codigo: 'QUI101-02', anio: 2025, semestre: 1, asignatura_id: 3, cupos: 30 },

    // INF101 - Introducción a la Programación
    { id: 7, codigo: 'INF101-01', anio: 2025, semestre: 1, asignatura_id: 4, cupos: 40 },
    { id: 8, codigo: 'INF101-02', anio: 2025, semestre: 1, asignatura_id: 4, cupos: 38 },

    // MAT201 - Álgebra Lineal
    { id: 9, codigo: 'MAT201-01', anio: 2025, semestre: 2, asignatura_id: 5, cupos: 35 },
    { id: 10, codigo: 'MAT201-02', anio: 2025, semestre: 2, asignatura_id: 5, cupos: 30 },

    // MAT202 - Cálculo II
    { id: 11, codigo: 'MAT202-01', anio: 2025, semestre: 2, asignatura_id: 6, cupos: 36 },
    { id: 12, codigo: 'MAT202-02', anio: 2025, semestre: 2, asignatura_id: 6, cupos: 32 },

    // FIS201 - Física II
    { id: 13, codigo: 'FIS201-01', anio: 2025, semestre: 2, asignatura_id: 7, cupos: 28 },
    { id: 14, codigo: 'FIS201-02', anio: 2025, semestre: 2, asignatura_id: 7, cupos: 26 },

    // INF201 - Estructuras de Datos
    { id: 15, codigo: 'INF201-01', anio: 2025, semestre: 2, asignatura_id: 8, cupos: 40 },
    { id: 16, codigo: 'INF201-02', anio: 2025, semestre: 2, asignatura_id: 8, cupos: 35 },

    // EST301 - Probabilidades y Estadística
    { id: 17, codigo: 'EST301-01', anio: 2025, semestre: 3, asignatura_id: 9, cupos: 30 },
    { id: 18, codigo: 'EST301-02', anio: 2025, semestre: 3, asignatura_id: 9, cupos: 28 },

    // MAT301 - Ecuaciones Diferenciales
    { id: 19, codigo: 'MAT301-01', anio: 2025, semestre: 3, asignatura_id: 10, cupos: 32 },
    { id: 20, codigo: 'MAT301-02', anio: 2025, semestre: 3, asignatura_id: 10, cupos: 30 },

    // INF301 - Bases de Datos
    { id: 21, codigo: 'INF301-01', anio: 2025, semestre: 3, asignatura_id: 11, cupos: 40 },
    { id: 22, codigo: 'INF301-02', anio: 2025, semestre: 3, asignatura_id: 11, cupos: 38 },

    // INF302 - Programación Orientada a Objetos
    { id: 23, codigo: 'INF302-01', anio: 2025, semestre: 3, asignatura_id: 12, cupos: 40 },
    { id: 24, codigo: 'INF302-02', anio: 2025, semestre: 3, asignatura_id: 12, cupos: 36 },

    // INF401 - Sistemas Operativos
    { id: 25, codigo: 'INF401-01', anio: 2025, semestre: 4, asignatura_id: 13, cupos: 38 },
    { id: 26, codigo: 'INF401-02', anio: 2025, semestre: 4, asignatura_id: 13, cupos: 35 },

    // INF402 - Redes de Computadores
    { id: 27, codigo: 'INF402-01', anio: 2025, semestre: 4, asignatura_id: 14, cupos: 36 },
    { id: 28, codigo: 'INF402-02', anio: 2025, semestre: 4, asignatura_id: 14, cupos: 34 },

    // INF403 - Ingeniería de Software I
    { id: 29, codigo: 'INF403-01', anio: 2025, semestre: 4, asignatura_id: 15, cupos: 40 },
    { id: 30, codigo: 'INF403-02', anio: 2025, semestre: 4, asignatura_id: 15, cupos: 36 },

    // ELE501 - Electrónica I
    { id: 31, codigo: 'ELE501-01', anio: 2025, semestre: 5, asignatura_id: 16, cupos: 30 },
    { id: 32, codigo: 'ELE501-02', anio: 2025, semestre: 5, asignatura_id: 16, cupos: 28 },

    // INF501 - Inteligencia Artificial
    { id: 33, codigo: 'INF501-01', anio: 2025, semestre: 5, asignatura_id: 17, cupos: 40 },
    { id: 34, codigo: 'INF501-02', anio: 2025, semestre: 5, asignatura_id: 17, cupos: 36 },

    // INF502 - Compiladores
    { id: 35, codigo: 'INF502-01', anio: 2025, semestre: 5, asignatura_id: 18, cupos: 38 },
    { id: 36, codigo: 'INF502-02', anio: 2025, semestre: 5, asignatura_id: 18, cupos: 36 },

    // INF601 - Seguridad Informática
    { id: 37, codigo: 'INF601-01', anio: 2025, semestre: 6, asignatura_id: 19, cupos: 40 },
    { id: 38, codigo: 'INF601-02', anio: 2025, semestre: 6, asignatura_id: 19, cupos: 38 },

    // INF602 - Minería de Datos
    { id: 39, codigo: 'INF602-01', anio: 2025, semestre: 6, asignatura_id: 20, cupos: 36 },
    { id: 40, codigo: 'INF602-02', anio: 2025, semestre: 6, asignatura_id: 20, cupos: 34 },
];
