export interface SeccionDTO {
    id: number; // PK
    codigo: string;
    anio: number;
    semestre: number;
    asignatura_id: number; // FK -> Asignatura.id
    cupos: number;
}

export type NuevaSeccionDTO = Omit<SeccionDTO, 'id' | 'asignatura_id'>;
export type ActualizarSeccionDTO = Partial<Omit<SeccionDTO, 'id'>>;
