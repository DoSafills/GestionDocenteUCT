import { BaseEntity } from '@/domain/entities/BaseEntity';
import type { EdificioDTO } from './types';

export class Edificio extends BaseEntity<EdificioDTO> {
  get nombre() {
    return this.toDTO().nombre;
  }
  set nombre(value: string) {
    const v = (value ?? '').trim();
    if (v.length < 2) throw new Error('nombre inválido');
    (this as any).data.nombre = v;
  }
  get pisos() {
    return this.toDTO().pisos ?? null;
  }
  set pisos(value: number | null | undefined) {
    if (value != null && value < 1) throw new Error('pisos inválido');
    (this as any).data.pisos = value ?? null;
  }
  get campus_id() {
    return this.toDTO().campus_id;
  }
}
