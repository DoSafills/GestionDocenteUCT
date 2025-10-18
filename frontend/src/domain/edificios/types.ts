export interface EdificioDTO {
  id: number;
  nombre: string;
  pisos?: number | null;
  campus_id: number;
}

export type EdificioCreateDTO = Omit<EdificioDTO, 'id'>;
