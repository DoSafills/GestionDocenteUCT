import { BaseEntity } from '../BaseEntity';
import type { SeccionDTO } from './types';

export class Seccion extends BaseEntity<SeccionDTO> {
    get id() {
        return this.data.id;
    }

    get codigo() {
        return this.data.codigo;
    }

    get anio() {
        return this.data.codigo;
    }

    get semestre() {
        return this.data.semestre;
    }

    get asignatura_id() {
        return this.data.asignatura_id;
    }

    get cupos() {
        return this.data.cupos;
    }
}
