import { MockRepository } from '@/infraestructure/repositories/MockRepository';
import type { EdificioDTO } from '@/domain/edificios/types';
import { edificiosMock } from '@/data/edificios';

export class EdificioMockRepository extends MockRepository<EdificioDTO> {
  constructor() {
    super(edificiosMock);
  }

  async getByCampus(campusId: number): Promise<EdificioDTO[]> {
    const all = await this.getAll();
    return all.filter(e => e.campus_id === campusId);
  }
}
