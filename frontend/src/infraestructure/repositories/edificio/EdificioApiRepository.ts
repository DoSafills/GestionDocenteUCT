import { ApiRepository } from '@/infraestructure/repositories/ApiRepository';
import type { EdificioDTO } from '@/domain/edificios/types';

export class EdificioApiRepository extends ApiRepository<EdificioDTO> {
  constructor(endpoint: string) {
    super(endpoint);
  }

  async getByCampus(campusId: number): Promise<EdificioDTO[]> {
    const res = await fetch(`${this.endpoint}/campus/${campusId}`, { headers: this.getHeaders() });
    return this['handleResponse']<EdificioDTO[]>(res);
  }
}
