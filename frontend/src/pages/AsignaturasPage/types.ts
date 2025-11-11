export interface Asignatura {
    id: number;
    codigo: string; // ej: MAT1105-07
    nombre: string;
    creditos: number;
    semestre: number;
}

export interface Bloque {
    id: number; // PK
    dia_semana: number; // 1 = Lunes, ..., 7 = Domingo
    hora_inicio: string; // formato "HH:MM:SS"
    hora_fin: string; // formato "HH:MM:SS"
}

export interface Seccion {
    id: number; // PK
    codigo: string;
    anio: number;
    semestre: number;
    asignatura_id: number; // FK -> Asignatura.id
    cupos: number;
}

export interface Sala {
    id: number; // PK
    codigo: string;
    capacidad: number;
    tipo: string; // ejemplo: "Laboratorio", "Aula", etc.
    esta_disponible: boolean;
    edificio_id: number; // FK -> Edificio.id
    equipamiento: string; // lista o descripción de equipos
}

export interface AsignaturaFormDialogProps {
    open: boolean;
    asignaturaId?: number;
    onOpenChange: (v: boolean) => void;
    onSubmit: (data: Omit<Asignatura, 'id'>, secciones: Omit<Seccion, 'id' | 'asignatura_id'>[]) => void;
}
