import type { EdificioDTO } from '@/domain/edificios/types';

export const edificiosMock: EdificioDTO[] = [
  { id: 1, nombre: 'A', pisos: 3, campus_id: 1 },
  { id: 2, nombre: 'B', pisos: 5, campus_id: 1 },
  { id: 3, nombre: 'C', pisos: 2, campus_id: 2 },
  { id: 4, nombre: 'D', pisos: 4, campus_id: 3 },
];
