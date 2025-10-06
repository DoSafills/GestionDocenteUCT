export interface ClaseMock {
  id: number;
  clase_id: string;     // identificador visible/estable
  seccion_id: number;   //(referencia a seccionesMock.id)
  docente_id: number;   // referencia a docentesMock.id
  sala_codigo: string;  // referencia a salasMock.codigo (o prefijo CJPxx)
  bloque_id: number;    //numérico (referencia a bloquesMock.id)
  estado: "activo" | "cancelado" | "reprogramado";
}


export const clasesMock: ClaseMock[] = [
  {
    id: 1,
    clase_id: "H-MAT101-L1B1",
    seccion_id: 1,                  // MAT101-01
    docente_id: 201,                // Ana Pérez
    sala_codigo: "CJP07_101",
    bloque_id: 1,                   // Lunes 08:00-10:00
    estado: "activo",
  },
  {
    id: 2,
    clase_id: "H-INF101-L2B1",
    seccion_id: 7,                  // INF101-01
    docente_id: 202,                // Luis García
    sala_codigo: "CJP07_201",
    bloque_id: 4,                   // Martes 08:00-10:00
    estado: "activo",
  },
  {
    id: 3,
    clase_id: "H-INF201-L1B2",
    seccion_id: 15,                 // INF201-01
    docente_id: 204,                // Carlos Sánchez
    sala_codigo: "CJP07_332",
    bloque_id: 2,                   // Lunes 10:00-12:00
    estado: "reprogramado",
  },
  {
    id: 4,
    clase_id: "H-MAT201-L3B1",
    seccion_id: 9,                  // MAT201-01
    docente_id: 201,                // Ana Pérez
    sala_codigo: "CJP07_134",
    bloque_id: 7,                   // Miércoles 08:00-10:00
    estado: "activo",
  },
];
