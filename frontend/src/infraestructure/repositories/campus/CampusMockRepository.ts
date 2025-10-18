import { MockRepository } from '@/infraestructure/repositories/MockRepository';
import type { CampusDTO } from '@/domain/campus/types';
import { campusMock } from '@/data/campus';

export class CampusMockRepository extends MockRepository<CampusDTO> {
  constructor() {
    super(campusMock);
  }
}
