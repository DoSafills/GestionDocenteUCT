import { ApiRepository } from '@/infraestructure/repositories/ApiRepository';
import type { EdificioDTO } from '@/domain/edificios/types';
import type { IEdificioRepository } from '@/domain/repositories/IEdificioRepository';

export class EdificioApiRepository
  extends ApiRepository<EdificioDTO>
  implements IEdificioRepository { // <-- aquí
  constructor(endpoint: string) {
    super(endpoint);
  }
  async getByCampus(campusId: number): Promise<EdificioDTO[]> {
    const res = await fetch(`${this.endpoint}/campus/${campusId}`, { headers: this.getHeaders() });
    return this['handleResponse']<EdificioDTO[]>(res);
  }
}
