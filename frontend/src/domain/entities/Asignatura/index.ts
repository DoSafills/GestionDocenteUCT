import { BaseEntity } from '../BaseEntity';
import type { AsignaturaDTO } from './types';

export class Asignatura extends BaseEntity<AsignaturaDTO> {
    get id() {
        return this.data.id;
    }

    get codigo() {
        return this.data.codigo;
    }

    get nombre() {
        return this.data.nombre;
    }

    get creditos() {
        return this.data.creditos;
    }

    get semestre() {
        return this.data.semestre;
    }

    set codigo(value: string) {
        if (!value.trim()) throw new Error('El código no puede estar vacío');
        this.data.codigo = value;
    }

    set nombre(value: string) {
        this.data.nombre = value;
    }

    set creditos(value: number) {
        this.data.creditos = value;
    }

    set semestre(value: number) {
        this.data.semestre = value;
    }
}

export * from './types';
