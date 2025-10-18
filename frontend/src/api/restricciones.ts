// src/api/restricciones.ts

import { ENDPOINTS } from '@endpoints/index';
import { ApiService } from '../../../frontend/src/pages/RestriccionesPage/services/apiservice';
import type { RestriccionDTO } from '../../../frontend/src/pages/RestriccionesPage/services/RestriccionDTO';

export class RestriccionApiService extends ApiService<RestriccionDTO> {
    constructor() {
        super(ENDPOINTS.RESTRICCIONES); 
    }
}


export const restriccionApiService = new RestriccionApiService();
