import { MockRepository } from '@/infraestructure/repositories/MockRepository';
import type { EdificioDTO } from '@/domain/edificios/types';
import { edificiosMock } from '@/data/edificios';
import type { IEdificioRepository } from '@/domain/repositories/IEdificioRepository';

export class EdificioMockRepository
  extends MockRepository<EdificioDTO>
  implements IEdificioRepository { // <-- aquí
  constructor() {
    super(edificiosMock);
  }
  async getByCampus(campusId: number): Promise<EdificioDTO[]> {
    const all = await this.getAll();
    return all.filter(e => e.campus_id === campusId);
  }
}
