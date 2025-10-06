import type { Sala } from '@pages/AsignaturasPage/types';

/**
 * Mock de salas en formato tradicional y con códigos reales (CJPxx_NUM).
 * Mapeo edificio_id:
 *   CJP01:1, CJP02:2, CJP03:3, CJP04:4, CJP05:5, CJP06:6,
 *   CJP07:7, CJP08:8, CJP09:9, CJP10:10, CJP11:11, CJP12:12
 */

export const salasMock: Sala[] = [
  // CJP07 — Ricardo Ferrando (id: 7)
  { id: 7001, codigo: 'CJP07_101', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7002, codigo: 'CJP07_103', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7003, codigo: 'CJP07_107', capacidad: 38, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7004, codigo: 'CJP07_117', capacidad: 36, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7005, codigo: 'CJP07_132', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7006, codigo: 'CJP07_134', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7007, codigo: 'CJP07_175', capacidad: 42, tipo: 'Multitaller Educación',   esta_disponible: true, edificio_id: 7, equipamiento: 'Mesones, Proyector' },
  { id: 7008, codigo: 'CJP07_201', capacidad: 32, tipo: 'Laboratorio Computación', esta_disponible: true, edificio_id: 7, equipamiento: 'PCs, Red, Proyector' },
  { id: 7009, codigo: 'CJP07_203', capacidad: 32, tipo: 'Sala Robótica',           esta_disponible: true, edificio_id: 7, equipamiento: 'Kits robótica, PCs, Proyector' },
  { id: 7010, codigo: 'CJP07_215', capacidad: 30, tipo: 'Laboratorio de Proyectos',esta_disponible: true, edificio_id: 7, equipamiento: 'Mesones, PCs, Proyector' },
  { id: 7011, codigo: 'CJP07_217', capacidad: 32, tipo: 'Laboratorio Computación', esta_disponible: true, edificio_id: 7, equipamiento: 'PCs, Red, Proyector' },
  { id: 7012, codigo: 'CJP07_232', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7013, codigo: 'CJP07_234', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7014, codigo: 'CJP07_236', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7015, codigo: 'CJP07_238', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7016, codigo: 'CJP07_261', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7017, codigo: 'CJP07_263', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7018, codigo: 'CJP07_265', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7019, codigo: 'CJP07_275', capacidad: 28, tipo: 'Laboratorio de Suelos',   esta_disponible: true, edificio_id: 7, equipamiento: 'Mesones, Equipos de ensayo' },
  { id: 7020, codigo: 'CJP07_301', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7021, codigo: 'CJP07_317', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7022, codigo: 'CJP07_325', capacidad: 140, tipo: 'Auditorium',             esta_disponible: true, edificio_id: 7, equipamiento: 'Audio, Pantalla, Proyector' },
  { id: 7023, codigo: 'CJP07_332', capacidad: 32, tipo: 'Laboratorio Computación', esta_disponible: true, edificio_id: 7, equipamiento: 'PCs, Red, Proyector' },
  { id: 7024, codigo: 'CJP07_334', capacidad: 30, tipo: 'Taller Inglés I',         esta_disponible: true, edificio_id: 7, equipamiento: 'Audio, Proyector' },
  { id: 7025, codigo: 'CJP07_350', capacidad: 30, tipo: 'Taller Inglés II',        esta_disponible: true, edificio_id: 7, equipamiento: 'Audio, Proyector' },
  { id: 7026, codigo: 'CJP07_361', capacidad: 30, tipo: 'Sala Tecnológica',        esta_disponible: true, edificio_id: 7, equipamiento: 'Equipos multimedia' },
  { id: 7027, codigo: 'CJP07_363', capacidad: 30, tipo: 'Taller Inglés',           esta_disponible: true, edificio_id: 7, equipamiento: 'Audio, Proyector' },
  { id: 7028, codigo: 'CJP07_365', capacidad: 30, tipo: 'Taller Diseño Temporal',  esta_disponible: true, edificio_id: 7, equipamiento: 'Mesones, Proyector' },
  { id: 7029, codigo: 'CJP07_375', capacidad: 30, tipo: 'Sala Tecnológica',        esta_disponible: true, edificio_id: 7, equipamiento: 'Equipos multimedia' },
  { id: 7030, codigo: 'CJP07_432', capacidad: 26, tipo: 'Laboratorio Geomática',   esta_disponible: true, edificio_id: 7, equipamiento: 'Equipos topográficos, PCs' },
  { id: 7031, codigo: 'CJP07_461', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 7, equipamiento: 'Pizarra, Proyector' },
  { id: 7032, codigo: 'CJP07_463', capacidad: 40, tipo: 'Sala Híbrida',            esta_disponible: true, edificio_id: 7, equipamiento: 'Cámaras, Audio, Proyector' },
  { id: 7033, codigo: 'CJP07_465', capacidad: 40, tipo: 'Sala Híbrida',            esta_disponible: true, edificio_id: 7, equipamiento: 'Cámaras, Audio, Proyector' },
  { id: 7034, codigo: 'CJP07_475', capacidad: 26, tipo: 'Lab. Geología (Híbrida)', esta_disponible: true, edificio_id: 7, equipamiento: 'Mesones, Equipamiento lab' },
  { id: 7035, codigo: 'CJP07_590', capacidad: 24, tipo: 'Lab. Química/Biología',   esta_disponible: true, edificio_id: 7, equipamiento: 'Mesones, Vidriería, Microscopios' },

  // CJP01 — FAAD (id: 1) — ejemplos
  { id: 1001, codigo: 'CJP01_115', capacidad: 25, tipo: 'Taller Escultura',        esta_disponible: true, edificio_id: 1, equipamiento: 'Mesones, Herramientas' },
  { id: 1002, codigo: 'CJP01_150', capacidad: 25, tipo: 'Taller Pintura',          esta_disponible: true, edificio_id: 1, equipamiento: 'Atriles, Mesones' },

  // CJP03 — Agustina Hidalgo (id: 3) — ejemplos
  { id: 3001, codigo: 'CJP03_103', capacidad: 40, tipo: 'Sala Cátedra (Híbrida)',  esta_disponible: true, edificio_id: 3, equipamiento: 'Cámaras, Audio, Proyector' },
  { id: 3002, codigo: 'CJP03_109', capacidad: 40, tipo: 'Sala Cátedra',            esta_disponible: true, edificio_id: 3, equipamiento: 'Pizarra, Proyector' },

  // CJP08 — Adalberto Salas (id: 8) — ejemplos
  { id: 8001, codigo: 'CJP08_102', capacidad: 24, tipo: 'Lab. Biología General',   esta_disponible: true, edificio_id: 8, equipamiento: 'Mesones, Microscopios' },
  { id: 8002, codigo: 'CJP08_170', capacidad: 24, tipo: 'Lab. Química II (Híbrida)', esta_disponible: true, edificio_id: 8, equipamiento: 'Mesones, Campana, Proyector' },

  // CJP10 — Waldo Marchant (id: 10) — ejemplo
  { id: 10001, codigo: 'CJP10_110', capacidad: 100, tipo: 'Anfiteatro (Híbrida)',  esta_disponible: true, edificio_id: 10, equipamiento: 'Audio, Pantalla, Cámaras' },

  // CJP12 — Complejo Deportivo (id: 12) — ejemplo
  { id: 12001, codigo: 'CJP12_150', capacidad: 40, tipo: 'Sala Cátedra',           esta_disponible: true, edificio_id: 12, equipamiento: 'Pizarra, Proyector' },
];
