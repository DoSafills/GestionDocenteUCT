import { BaseEntity } from '@/domain/entities/BaseEntity';
import type { CampusDTO } from './types';

export class Campus extends BaseEntity<CampusDTO> {
  get nombre() {
    return this.toDTO().nombre;
  }
  set nombre(value: string) {
    const v = (value ?? '').trim();
    if (v.length < 2) throw new Error('nombre inválido');
    (this as any).data.nombre = v;
  }
  get direccion() {
    return this.toDTO().direccion ?? null;
  }
  set direccion(value: string | null | undefined) {
    (this as any).data.direccion = (value ?? null);
  }
}
