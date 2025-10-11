export interface EdificioMock {
  id: number;         // PK
  nombre: string;     // Ej: "CJP01 - FAAD"
  tipo: string;       // Ej: "Facultad", "Docencia", "Laboratorios", "Deportivo", etc.
  campus_id: number;  // FK a CampusMock.id
}

/**
 * Nombres tomados del JSON de salas:
 * - CJP01 -> FAAD
 * - CJP02 -> Diseño
 * - CJP03 -> Agustina Hidalgo
 * - CJP07 -> Ricardo Ferrando
 * - CJP08 -> Adalberto Salas
 * - CJP10 -> Waldo Marchant
 * - CJP12 -> Complejo Deportivo
 *
 * Edificios sin nombre en el JSON (CJP04, CJP05, CJP06, CJP09, CJP11) quedan como "Por asignar".
 */
export const edificiosMock: EdificioMock[] = [
  { id: 1,  nombre: "CJP01 - FAAD",                 tipo: "Facultad",      campus_id: 1 },
  { id: 2,  nombre: "CJP02 - Diseño",               tipo: "Facultad",      campus_id: 1 },
  { id: 3,  nombre: "CJP03 - Agustina Hidalgo",     tipo: "Docencia",      campus_id: 1 },
  { id: 4,  nombre: "CJP04 - Por asignar",          tipo: "Por definir",   campus_id: 1 },
  { id: 5,  nombre: "CJP05 - Por asignar",          tipo: "Por definir",   campus_id: 1 },
  { id: 6,  nombre: "CJP06 - Por asignar",          tipo: "Por definir",   campus_id: 1 },
  { id: 7,  nombre: "CJP07 - Ricardo Ferrando",     tipo: "Docencia",      campus_id: 1 },
  { id: 8,  nombre: "CJP08 - Adalberto Salas",      tipo: "Laboratorios",  campus_id: 1 },
  { id: 9,  nombre: "CJP09 - Por asignar",          tipo: "Por definir",   campus_id: 1 },
  { id: 10, nombre: "CJP10 - Waldo Marchant",       tipo: "Docencia",      campus_id: 1 },
  { id: 11, nombre: "CJP11 - Por asignar",          tipo: "Por definir",   campus_id: 1 },
  { id: 12, nombre: "CJP12 - Complejo Deportivo",   tipo: "Deportivo",     campus_id: 1 },
];
