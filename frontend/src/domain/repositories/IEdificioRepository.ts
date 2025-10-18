import type { EdificioDTO } from '@/domain/edificios/types';

export interface IEdificioRepository {
  getByCampus(campusId: number): Promise<EdificioDTO[]>;
}
