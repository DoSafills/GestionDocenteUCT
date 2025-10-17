import { BaseEntity } from '@/domain/entities/BaseEntity';
import type { SalaDTO, SalaTipo } from './types';

const tipos: SalaTipo[] = ['aula','laboratorio','auditorio','taller','sala_conferencias'];

export class Sala extends BaseEntity<SalaDTO> {
  get codigo() {
    return this.toDTO().codigo;
  }
  set codigo(value: string) {
    const v = (value ?? '').toUpperCase().trim();
    if (!/^[A-Z0-9-]+$/.test(v)) throw new Error('codigo inválido');
    (this as any).data.codigo = v;
  }
  get capacidad() {
    return this.toDTO().capacidad;
  }
  set capacidad(value: number) {
    if (value == null || value < 1 || value > 500) throw new Error('capacidad inválida');
    (this as any).data.capacidad = value;
  }
  get tipo() {
    return this.toDTO().tipo;
  }
  set tipo(value: SalaTipo) {
    const v = (value as string ?? '').toLowerCase() as SalaTipo;
    if (!tipos.includes(v)) throw new Error('tipo inválido');
    (this as any).data.tipo = v;
  }
  get disponible() {
    return this.toDTO().disponible;
  }
  set disponible(value: boolean) {
    (this as any).data.disponible = !!value;
  }
  get equipamiento() {
    return this.toDTO().equipamiento ?? null;
  }
  set equipamiento(value: string | null | undefined) {
    (this as any).data.equipamiento = value ?? null;
  }
  get edificio_id() {
    return this.toDTO().edificio_id;
  }
}
