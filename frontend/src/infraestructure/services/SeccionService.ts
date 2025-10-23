import {
    seccionApiRepository,
    seccionMockRepository,
    type SeccionApiRepository,
    type SeccionMockRepository,
} from '../repositories/Secciones';

import { Seccion } from '@/domain/entities/Seccion';
import type { SeccionDTO } from '@/domain/entities/Seccion/types';
import { BaseService } from './BaseService';

export class SeccionService extends BaseService<Seccion, SeccionDTO> {
    constructor(repository: SeccionApiRepository | SeccionMockRepository) {
        super(repository, (dto) => new Seccion(dto));
    }

    async obtenerPorAsignaturaId(asignaturaId: number) {
        const dtos = await this.repository.getAll();

        const filtered = dtos.filter((s) => s.asignatura_id === asignaturaId);

        return filtered.map((dto) => new Seccion(dto));
    }
}

// export const asignaturaService = new AsignaturaService(asignaturaApiRepository);

export const seccionService = new SeccionService(seccionMockRepository);
