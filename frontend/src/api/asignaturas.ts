import { ApiService } from '@api/base';
import { ENDPOINTS } from '@endpoints/index';
import type { Asignatura } from '@/types';

export class AsignaturasService extends ApiService<Asignatura> {
    constructor() {
        super(ENDPOINTS.ASIGNATURAS);
    }
}
