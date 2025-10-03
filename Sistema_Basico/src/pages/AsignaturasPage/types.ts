// =========================
// Tipos base del sistema académico
// =========================

export interface Asignatura {
    id: number;
    codigo: string;
    nombre: string;
    creditos: number;
    semestre: number;
}

export interface Seccion {
    id: number;
    codigo: string;
    anio: number;
    semestre: number;
    asignaturaId: number; // FK -> Asignatura
    cupos: number;
}

export interface Docente {
    id: number;
    nombre: string;
    email: string;
    passwordHash: string;
    estaActivo: boolean;
    especialidad: string;
}

export interface Estudiante {
    id: number;
    nombre: string;
    email: string;
    passHash: string;
    carrera: string;
}

export interface Admin {
    id: number;
    nombre: string;
    email: string;
    passHash: string;
    superAdmin: boolean;
}

export interface Campus {
    id: number;
    nombre: string;
    direccion: string;
}

export interface Edificio {
    id: number;
    nombre: string;
    tipo: string;
    campusId: number; // FK -> Campus
}

export interface Sala {
    id: number;
    codigo: string;
    capacidad: number;
    tipo: 'aula' | 'laboratorio' | 'auditorio' | 'sala_computacion';
    estaDisponible: boolean;
    edificioId: number; // FK -> Edificio
    equipamiento: string; // texto plano
}

export interface Bloque {
    id: number;
    diaSemana: number; // 1 = Lunes, 7 = Domingo
    horaInicio: string; // formato HH:mm
    horaFin: string; // formato HH:mm
}

export interface Clase {
    id: number;
    seccionId: number; // FK -> Seccion
    docenteId: number; // FK -> Docente
    salaId: number; // FK -> Sala
    bloqueId: number; // FK -> Bloque
    estado: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
}

export interface Restriccion {
    id: number;
    docenteId: number; // FK -> Docente
    tipo: string;
    valor: string;
    prioridad: number; // float
    esDura: boolean;
    estaActiva: boolean;
}

export interface RestriccionHorario {
    id: number;
    docenteId: number; // FK -> Docente
    diaSemana: number; // 1 = Lunes, etc.
    horaInicio: string;
    horaFin: string;
    estaDisponible: boolean;
    descripcion: string;
    estaActiva: boolean;
}
