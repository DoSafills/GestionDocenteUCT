import {
    asignaturaMockRepository,
    asignaturaApiRepository,
    type AsignaturaMockRepository,
    type AsignaturaApiRepository,
} from '@infraestructure/repositories/Asignaturas';

import { Asignatura } from '@/domain/entities/Asignatura';
import type { AsignaturaDTO } from '@/domain/entities/Asignatura/types';
import { normalize } from '@utils/string';
import { BaseService } from './BaseService';

export class AsignaturaService extends BaseService<Asignatura, AsignaturaDTO> {
    constructor(repo: AsignaturaApiRepository | AsignaturaMockRepository) {
        super(repo, (dto) => new Asignatura(dto));
    }

    async filtrarPorQuery(query: string): Promise<Asignatura[]> {
        const q = normalize(query);

        return super.filtrarPor(
            (dto) =>
                normalize(dto.nombre).includes(q) ||
                normalize(dto.codigo).includes(q) ||
                normalize(dto.creditos).includes(q) ||
                normalize(dto.semestre).includes(q),
        );
    }
}

// export const asignaturaService = new AsignaturaService(asignaturaApiRepository);

export const asignaturaService = new AsignaturaService(asignaturaMockRepository);
