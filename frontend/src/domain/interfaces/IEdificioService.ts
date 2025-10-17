import type { Edificio } from '@/domain/edificios';
import type { IService } from '@/domain/interfaces/IService';
import type { EdificioDTO } from '@/domain/edificios/types';

export interface IEdificioService extends IService<Edificio, EdificioDTO> {
  listarPorCampus(campusId: number): Promise<Edificio[]>;
}
