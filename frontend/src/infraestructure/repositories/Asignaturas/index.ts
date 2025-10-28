import type { AsignaturaDTO } from '@/domain/entities/Asignatura/types';
import { ENDPOINTS } from '@/infraestructure/endpoints';
import { ApiRepository } from '../ApiRepository';
import { MockRepository } from '../MockRepository';
import asignaturasMock from '@/infraestructure/mocks/asignaturas.mock';

export class AsignaturaApiRepository extends ApiRepository<AsignaturaDTO> {
    constructor() {
        super(ENDPOINTS.ASIGNATURAS);
    }
}

export class AsignaturaMockRepository extends MockRepository<AsignaturaDTO> {
    constructor() {
        super(asignaturasMock);
    }
}

export const asignaturaApiRepository = new AsignaturaApiRepository();
export const asignaturaMockRepository = new AsignaturaMockRepository();
