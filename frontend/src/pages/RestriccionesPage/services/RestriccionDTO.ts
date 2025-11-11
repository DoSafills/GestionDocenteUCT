export interface RestriccionDTO {
  id?: number;
  tipo: string;
  valor: string;
  prioridad: number;
  restriccion_blanda: boolean;
  restriccion_dura: boolean;
}
