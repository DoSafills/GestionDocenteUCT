export interface CampusDTO {
  id: number;
  nombre: string;
  direccion?: string | null;
}

export type CampusCreateDTO = Omit<CampusDTO, "id">;
