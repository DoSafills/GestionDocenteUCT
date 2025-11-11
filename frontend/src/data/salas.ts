import type { SalaDTO } from '@/domain/salas/types';

export const salasMock: SalaDTO[] = [
  { id: 1, codigo: 'CJP07-101', capacidad: 40, tipo: 'aula', disponible: true, equipamiento: 'proyector', edificio_id: 1 },
  { id: 2, codigo: 'CJP07-102', capacidad: 30, tipo: 'laboratorio', disponible: false, equipamiento: 'pc', edificio_id: 1 },
  { id: 3, codigo: 'CJP07-201', capacidad: 80, tipo: 'auditorio', disponible: true, equipamiento: 'sonido', edificio_id: 1 },
  { id: 4, codigo: 'CJP01-101', capacidad: 25, tipo: 'aula', disponible: true, equipamiento: 'pizarra', edificio_id: 2 },
  { id: 5, codigo: 'CJP01-102', capacidad: 30, tipo: 'aula', disponible: true, equipamiento: 'proyector', edificio_id: 2 },
  { id: 6, codigo: 'CJP10-301', capacidad: 50, tipo: 'sala_conferencias', disponible: false, equipamiento: 'videoconferencia', edificio_id: 3 },
  { id: 7, codigo: 'CJP10-302', capacidad: 45, tipo: 'aula', disponible: true, equipamiento: 'proyector', edificio_id: 3 },
];
