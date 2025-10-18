import { ApiRepository } from '@/infraestructure/repositories/ApiRepository';
import type { CampusDTO } from '@/domain/campus/types';

export class CampusApiRepository extends ApiRepository<CampusDTO> {
  constructor(endpoint: string) {
    super(endpoint);
  }
}
