// src/api/restricciones.ts

import { ENDPOINTS } from '@endpoints/index';
import { ApiService } from '../../../frontend/src/pages/RestriccionesPage/services/apiservice';
import type { RestriccionDTO } from '../../../frontend/src/pages/RestriccionesPage/services/RestriccionDTO';

/**
 * Clase especializada para manejar las operaciones de restricciones académicas.
 * Extiende de ApiService con tipado específico de RestriccionDTO.
 */
export class RestriccionApiService extends ApiService<RestriccionDTO> {
    constructor() {
        super(ENDPOINTS.RESTRICCIONES); // usar la propiedad correcta del endpoint
    }
}

/**
 * Instancia lista para usar en toda la aplicación.
 */
export const restriccionApiService = new RestriccionApiService();
