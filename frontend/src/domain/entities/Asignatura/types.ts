export interface AsignaturaDTO {
    id: number;
    codigo: string; // ej: MAT1105-07
    nombre: string;
    creditos: number;
    semestre: number;
}

export type NuevaAsignaturaDTO = Omit<AsignaturaDTO, 'id'>;
export type ActualizarAsignaturaDTO = Partial<Omit<AsignaturaDTO, 'id'>>;
