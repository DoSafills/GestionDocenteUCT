export interface ClaseMock {
  id: number;
  clase_id: string;
  seccion_id: number;
  docente_id: number;
  sala_codigo: string;
  bloque_id: number;
  estado: "activo" | "cancelado" | "reprogramado";
}

export const clasesMock: ClaseMock[] = [
  { id: 1, clase_id: "H-MAT101-L1B1", seccion_id: 1, docente_id: 201, sala_codigo: "CJP07-101", bloque_id: 1, estado: "activo" },
  { id: 2, clase_id: "H-MAT101-L1B2", seccion_id: 1, docente_id: 201, sala_codigo: "CJP07-101", bloque_id: 2, estado: "activo" },
  { id: 3, clase_id: "H-MAT101-L4B1", seccion_id: 1, docente_id: 201, sala_codigo: "CJP07-101", bloque_id: 10, estado: "activo" },
  
  { id: 4, clase_id: "H-FIS101-L2B1", seccion_id: 3, docente_id: 202, sala_codigo: "CJP07-102", bloque_id: 4, estado: "activo" },
  { id: 5, clase_id: "H-FIS101-L2B2", seccion_id: 3, docente_id: 202, sala_codigo: "CJP07-102", bloque_id: 5, estado: "activo" },
  { id: 6, clase_id: "H-FIS101-L5B1", seccion_id: 3, docente_id: 202, sala_codigo: "CJP07-102", bloque_id: 13, estado: "activo" },

  { id: 7, clase_id: "H-QUI101-L3B1", seccion_id: 5, docente_id: 203, sala_codigo: "CJP07-201", bloque_id: 7, estado: "activo" },
  { id: 8, clase_id: "H-QUI101-L3B2", seccion_id: 5, docente_id: 203, sala_codigo: "CJP07-201", bloque_id: 8, estado: "activo" },
  
  { id: 9, clase_id: "H-INF101-L1B3", seccion_id: 7, docente_id: 204, sala_codigo: "CJP01-101", bloque_id: 3, estado: "activo" },
  { id: 10, clase_id: "H-INF101-L4B2", seccion_id: 7, docente_id: 204, sala_codigo: "CJP01-101", bloque_id: 11, estado: "activo" },
  { id: 11, clase_id: "H-INF101-L5B2", seccion_id: 7, docente_id: 204, sala_codigo: "CJP01-101", bloque_id: 14, estado: "activo" },

  { id: 12, clase_id: "H-MAT201-L2B1", seccion_id: 9, docente_id: 201, sala_codigo: "CJP01-102", bloque_id: 4, estado: "activo" },
  { id: 13, clase_id: "H-MAT201-L3B1", seccion_id: 9, docente_id: 201, sala_codigo: "CJP01-102", bloque_id: 7, estado: "reprogramado" },
  
  { id: 14, clase_id: "H-MAT202-L1B1", seccion_id: 11, docente_id: 205, sala_codigo: "CJP10-301", bloque_id: 1, estado: "activo" },
  { id: 15, clase_id: "H-MAT202-L2B2", seccion_id: 11, docente_id: 205, sala_codigo: "CJP10-301", bloque_id: 5, estado: "activo" },
  { id: 16, clase_id: "H-MAT202-L4B3", seccion_id: 11, docente_id: 205, sala_codigo: "CJP10-301", bloque_id: 12, estado: "activo" },

  { id: 17, clase_id: "H-FIS201-L2B1", seccion_id: 13, docente_id: 202, sala_codigo: "CJP10-302", bloque_id: 4, estado: "activo" },
  { id: 18, clase_id: "H-FIS201-L3B3", seccion_id: 13, docente_id: 202, sala_codigo: "CJP10-302", bloque_id: 9, estado: "cancelado" },
  
  { id: 19, clase_id: "H-INF201-L1B2", seccion_id: 15, docente_id: 204, sala_codigo: "CJP07-101", bloque_id: 2, estado: "activo" },
  { id: 20, clase_id: "H-INF201-L2B3", seccion_id: 15, docente_id: 204, sala_codigo: "CJP07-101", bloque_id: 6, estado: "activo" },
  { id: 21, clase_id: "H-INF201-L5B1", seccion_id: 15, docente_id: 204, sala_codigo: "CJP07-101", bloque_id: 13, estado: "activo" },

  { id: 22, clase_id: "H-EST301-L3B1", seccion_id: 17, docente_id: 206, sala_codigo: "CJP07-201", bloque_id: 7, estado: "activo" },
  { id: 23, clase_id: "H-EST301-L4B1", seccion_id: 17, docente_id: 206, sala_codigo: "CJP07-201", bloque_id: 10, estado: "activo" },

  { id: 24, clase_id: "H-INF301-L1B1", seccion_id: 21, docente_id: 207, sala_codigo: "CJP01-101", bloque_id: 1, estado: "activo" },
  { id: 25, clase_id: "H-INF301-L3B2", seccion_id: 21, docente_id: 207, sala_codigo: "CJP01-101", bloque_id: 8, estado: "activo" },
  { id: 26, clase_id: "H-INF301-L5B3", seccion_id: 21, docente_id: 207, sala_codigo: "CJP01-101", bloque_id: 15, estado: "activo" },

  { id: 27, clase_id: "H-INF302-L2B1", seccion_id: 23, docente_id: 208, sala_codigo: "CJP10-301", bloque_id: 4, estado: "activo" },
  { id: 28, clase_id: "H-INF302-L4B2", seccion_id: 23, docente_id: 208, sala_codigo: "CJP10-302", bloque_id: 11, estado: "activo" },

  { id: 29, clase_id: "H-INF401-L1B3", seccion_id: 25, docente_id: 209, sala_codigo: "CJP07-102", bloque_id: 3, estado: "activo" },
  { id: 30, clase_id: "H-INF401-L3B1", seccion_id: 25, docente_id: 209, sala_codigo: "CJP07-102", bloque_id: 7, estado: "reprogramado" },

  // Clases específicas para el docente demo (ID 999)
  { id: 31, clase_id: "H-DEMO101-L1B1", seccion_id: 26, docente_id: 999, sala_codigo: "CJP01-101", bloque_id: 1, estado: "activo" },
  { id: 32, clase_id: "H-DEMO101-L1B2", seccion_id: 26, docente_id: 999, sala_codigo: "CJP01-101", bloque_id: 2, estado: "activo" },
  { id: 33, clase_id: "H-DEMO101-L3B1", seccion_id: 26, docente_id: 999, sala_codigo: "CJP01-102", bloque_id: 7, estado: "activo" },
  { id: 34, clase_id: "H-DEMO102-L2B1", seccion_id: 27, docente_id: 999, sala_codigo: "CJP07-201", bloque_id: 4, estado: "activo" },
  { id: 35, clase_id: "H-DEMO102-L4B1", seccion_id: 27, docente_id: 999, sala_codigo: "CJP10-302", bloque_id: 10, estado: "activo" },
];
