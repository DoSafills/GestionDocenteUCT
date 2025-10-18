import type { SalaDTO } from '@/domain/salas/types';

export const salasMock: SalaDTO[] = [
  { id: 1, codigo: 'A-101', capacidad: 40, tipo: 'aula', disponible: true, equipamiento: 'proyector', edificio_id: 1 },
  { id: 2, codigo: 'A-102', capacidad: 30, tipo: 'laboratorio', disponible: false, equipamiento: 'pc', edificio_id: 1 },
  { id: 3, codigo: 'B-201', capacidad: 80, tipo: 'auditorio', disponible: true, equipamiento: 'sonido', edificio_id: 2 },
  { id: 4, codigo: 'C-10', capacidad: 25, tipo: 'taller', disponible: true, equipamiento: 'herramientas', edificio_id: 3 },
  { id: 5, codigo: 'D-301', capacidad: 50, tipo: 'sala_conferencias', disponible: false, equipamiento: 'videoconferencia', edificio_id: 4 },
];
