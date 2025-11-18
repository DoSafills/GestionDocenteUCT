import type { SeccionDTO } from '@/domain/entities/Seccion/types';
import { ENDPOINTS } from '@/endpoints';
import { ApiRepository } from '../ApiRepository';
import { MockRepository } from '../MockRepository';
import seccionesMock from '@/infraestructure/mocks/secciones.mock';

export class SeccionApiRepository extends ApiRepository<SeccionDTO> {
    constructor() {
        super(ENDPOINTS.SECCIONES);
    }
}

export class SeccionMockRepository extends MockRepository<SeccionDTO> {
    constructor() {
        super(seccionesMock);
    }
}

export const seccionMockRepository = new SeccionMockRepository();
export const seccionApiRepository = new SeccionApiRepository();
