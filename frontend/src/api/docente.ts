import { ENDPOINTS } from '@endpoints/index';
import { ApiService } from '@/infraestructure/services/ApiService';
import type { Docente } from '@/pages/ProfesoresPage/types';

export class DocenteApiService extends ApiService<Docente> {
  constructor() {
    super(ENDPOINTS.DOCENTES);
  }
}

export const docenteApiService = new DocenteApiService();
