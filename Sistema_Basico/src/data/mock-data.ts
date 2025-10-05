// Datos mock para el sistema académico
import type { 
  Profesor, 
  Edificio, 
  Asignatura, 
  RestriccionAcademica, 
  HorarioManual,
  Campus,
  Seccion,
  Bloque,
  Clase
} from "../types";

export const profesoresMock: Profesor[] = [
  {
    id: "prof_1",
    docente_rut: "12345678-9",
    nombre: "Carlos",
    apellido: "Rodriguez",
    email: "carlos.rodriguez@universidad.edu",
    telefono: "+56912345678",
    pass_hash: "hashed_password_123",
    max_horas_docencia: 40,
    especialidad: ["Matemáticas", "Estadística", "Álgebra Lineal"],
    disponibilidad: {
      dias: ["Lunes", "Martes", "Miércoles", "Jueves"],
      horasInicio: "08:00",
      horasFin: "18:00"
    },
    experiencia: 15,
    estado: "activo",
    fechaContratacion: "2010-03-15"
  },
  {
    id: "prof_2",
    docente_rut: "23456789-0",
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@universidad.edu",
    telefono: "+56923456789",
    pass_hash: "hashed_password_456",
    max_horas_docencia: 35,
    especialidad: ["Programación", "Algoritmos", "Estructura de Datos"],
    disponibilidad: {
      dias: ["Lunes", "Miércoles", "Viernes"],
      horasInicio: "09:00",
      horasFin: "17:00"
    },
    experiencia: 8,
    estado: "activo",
    fechaContratacion: "2016-08-20"
  },
  {
    id: "prof_3",
    docente_rut: "34567890-1",
    nombre: "Ana",
    apellido: "López",
    email: "ana.lopez@universidad.edu",
    telefono: "+56934567890",
    pass_hash: "hashed_password_789",
    max_horas_docencia: 42,
    especialidad: ["Física", "Mecánica", "Termodinámica"],
    disponibilidad: {
      dias: ["Martes", "Jueves", "Viernes"],
      horasInicio: "08:30",
      horasFin: "16:30"
    },
    experiencia: 12,
    estado: "activo",
    fechaContratacion: "2012-01-10"
  },
  {
    id: "prof_4",
    docente_rut: "45678901-2",
    nombre: "Roberto",
    apellido: "Silva",
    email: "roberto.silva@universidad.edu",
    telefono: "+56945678901",
    pass_hash: "hashed_password_012",
    max_horas_docencia: 38,
    especialidad: ["Química", "Química Orgánica", "Laboratorio"],
    disponibilidad: {
      dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      horasInicio: "07:00",
      horasFin: "15:00"
    },
    experiencia: 20,
    estado: "activo",
    fechaContratacion: "2004-09-05"
  }
];

export const campusMock: Campus[] = [
  {
    id: "campus_1",
    codigo: "CP",
    nombre: "Campus Principal",
    direccion: "Av. Universidad 1234"
  },
  {
    id: "campus_2", 
    codigo: "CS",
    nombre: "Campus Sur",
    direccion: "Av. Sur 567"
  }
];

export const edificiosMock: Edificio[] = [
  {
    id: "edif_1",
    nombre: "Edificio de Ciencias",
    codigo: "CS01",
    tipo: "Académico",
    campus_id: 1, // Referencia numérica según types/index.ts
    salas: [
      {
        id: "sala_cs_101",
        codigo: "CS01_125",
        numero: "125",
        edificioId: "edif_1",
        capacidad: 40,
        tipo: "ATC",
        equipamiento: ["Proyector", "Pizarra", "Sistema de audio"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_cs_102",
        codigo: "CS01_130",
        numero: "130",
        edificioId: "edif_1",
        capacidad: 30,
        tipo: "LAB",
        equipamiento: ["Computadores", "Proyector", "Pizarra digital"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_cs_201",
        codigo: "CS01_201",
        numero: "201",
        edificioId: "edif_1",
        capacidad: 60,
        tipo: "ATC",
        equipamiento: ["Sistema de sonido", "Proyector HD", "Escenario"],
        disponible: true,
        horarios: []
      }
    ]
  },
  {
    id: "edif_2",
    nombre: "Edificio de Arquitectura y Urbanismo",
    codigo: "FAUD",
    tipo: "Académico",
    campus_id: 1,
    salas: [
      {
        id: "sala_faud_204",
        codigo: "FAUD_204",
        numero: "204",
        edificioId: "edif_2",
        capacidad: 45,
        tipo: "TALLER",
        equipamiento: ["Proyector", "Pizarra", "Aire acondicionado"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_faud_lab1",
        codigo: "FAUD_LAB1",
        numero: "LAB1",
        edificioId: "edif_2",
        capacidad: 25,
        tipo: "LAB",
        equipamiento: ["30 Computadores", "Proyector", "Software especializado"],
        disponible: true,
        horarios: []
      }
    ]
  },
  {
    id: "edif_4",
    nombre: "Centro de Desarrollo Tecnológico",
    codigo: "CJP07",
    tipo: "Tecnológico",
    campus_id: 1,
    salas: [
      {
        id: "sala_cjp_101",
        codigo: "CJP07_101",
        numero: "101",
        edificioId: "edif_4",
        capacidad: 35,
        tipo: "ATC",
        equipamiento: ["Proyector", "Pizarra inteligente", "Sistema de audio"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_cjp_102",
        codigo: "CJP07_102",
        numero: "102",
        edificioId: "edif_4",
        capacidad: 40,
        tipo: "LAB",
        equipamiento: ["20 Computadores", "Proyector", "Software de desarrollo"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_cjp_201",
        codigo: "CJP07_201",
        numero: "201",
        edificioId: "edif_4",
        capacidad: 50,
        tipo: "ATC",
        equipamiento: ["Proyector HD", "Sistema de videoconferencia", "Pizarra"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_cjp_lab2",
        codigo: "CJP07_LAB2",
        numero: "LAB2",
        edificioId: "edif_4",
        capacidad: 30,
        tipo: "LAB",
        equipamiento: ["25 Computadores", "Servidores", "Red avanzada"],
        disponible: true,
        horarios: []
      }
    ]
  }
];

export const asignaturasMock: Asignatura[] = [
  {
    id: "asig_1",
    codigo: "MAT1105",
    nombre: "Cálculo I",
    creditos: 6,
    semestre: 1,
    carrera: "Ingeniería Civil", // Agregado campo carrera
    profesorId: "prof_1",
    salaId: "sala_cs_101",
    horarios: [
      { dia: "Lunes", horaInicio: "08:30", horaFin: "10:00" },
      { dia: "Miércoles", horaInicio: "08:30", horaFin: "10:00" },
      { dia: "Viernes", horaInicio: "08:30", horaFin: "10:00" }
    ],
    prerrequisitos: [],
    cupos: 40,
    inscritos: 35,
    estado: "programada",
    descripcion: "Introducción al cálculo diferencial e integral"
  },
  {
    id: "asig_2",
    codigo: "INF1001",
    nombre: "Introducción a la Programación",
    creditos: 6,
    semestre: 1,
    carrera: "Ingeniería en Informática",
    profesorId: "prof_2",
    salaId: "sala_faud_lab1",
    horarios: [
      { dia: "Martes", horaInicio: "10:15", horaFin: "12:30" },
      { dia: "Jueves", horaInicio: "10:15", horaFin: "12:30" }
    ],
    prerrequisitos: [],
    cupos: 25,
    inscritos: 23,
    estado: "programada",
    descripcion: "Fundamentos de programación en Python"
  },
  {
    id: "asig_3",
    codigo: "FIS1001",
    nombre: "Física General I",
    creditos: 6,
    semestre: 2,
    carrera: "Ingeniería Civil",
    profesorId: "prof_3",
    salaId: "sala_cs_102",
    horarios: [
      { dia: "Lunes", horaInicio: "14:00", horaFin: "15:30" },
      { dia: "Miércoles", horaInicio: "14:00", horaFin: "15:30" }
    ],
    prerrequisitos: ["MAT1105"],
    cupos: 30,
    inscritos: 28,
    estado: "programada",
    descripcion: "Mecánica clásica y ondas"
  },
  {
    id: "asig_4",
    codigo: "QUI2001",
    nombre: "Química General",
    creditos: 4,
    semestre: 1,
    carrera: "Ingeniería Química",
    profesorId: "prof_4",
    salaId: "sala_cs_102",
    horarios: [
      { dia: "Martes", horaInicio: "08:30", horaFin: "10:00" },
      { dia: "Jueves", horaInicio: "08:30", horaFin: "10:00" }
    ],
    prerrequisitos: [],
    cupos: 30,
    inscritos: 25,
    estado: "programada",
    descripcion: "Fundamentos de química general y laboratorio"
  },
  {
    id: "asig_5",
    codigo: "MAT2205",
    nombre: "Cálculo II",
    creditos: 6,
    semestre: 2,
    carrera: "Ingeniería Civil",
    profesorId: "prof_1",
    horarios: [
      { dia: "Martes", horaInicio: "14:00", horaFin: "15:30" },
      { dia: "Jueves", horaInicio: "14:00", horaFin: "15:30" }
    ],
    prerrequisitos: ["MAT1105"],
    cupos: 35,
    inscritos: 0,
    estado: "planificada",
    descripcion: "Cálculo multivariable y ecuaciones diferenciales"
  }
];

export const bloquesMock: Bloque[] = [
  // LUNES
  {
    id: "bloque_1",
    bloque_id: "1",
    dia_semana: 1, // Lunes
    hora_inicio: "08:00",
    hora_fin: "09:30"
  },
  {
    id: "bloque_2",
    bloque_id: "2", 
    dia_semana: 1, // Lunes
    hora_inicio: "09:40",
    hora_fin: "11:10"
  },
  {
    id: "bloque_3",
    bloque_id: "3",
    dia_semana: 1, // Lunes
    hora_inicio: "11:20",
    hora_fin: "12:50"
  },
  {
    id: "bloque_4",
    bloque_id: "4",
    dia_semana: 1, // Lunes
    hora_inicio: "14:00",
    hora_fin: "15:30"
  },
  {
    id: "bloque_5",
    bloque_id: "5",
    dia_semana: 1, // Lunes
    hora_inicio: "15:40",
    hora_fin: "17:10"
  },
  
  // MARTES
  {
    id: "bloque_6",
    bloque_id: "6",
    dia_semana: 2, // Martes
    hora_inicio: "08:00", 
    hora_fin: "09:30"
  },
  {
    id: "bloque_7",
    bloque_id: "7",
    dia_semana: 2, // Martes
    hora_inicio: "09:40",
    hora_fin: "11:10"
  },
  {
    id: "bloque_8",
    bloque_id: "8",
    dia_semana: 2, // Martes
    hora_inicio: "11:20",
    hora_fin: "12:50"
  },
  {
    id: "bloque_9",
    bloque_id: "9",
    dia_semana: 2, // Martes
    hora_inicio: "14:00",
    hora_fin: "15:30"
  },
  {
    id: "bloque_10",
    bloque_id: "10",
    dia_semana: 2, // Martes
    hora_inicio: "16:00",
    hora_fin: "17:30"
  },
  
  // MIÉRCOLES
  {
    id: "bloque_11",
    bloque_id: "11",
    dia_semana: 3, // Miércoles
    hora_inicio: "08:00",
    hora_fin: "09:30"
  },
  {
    id: "bloque_12",
    bloque_id: "12",
    dia_semana: 3, // Miércoles
    hora_inicio: "09:40",
    hora_fin: "11:10"
  },
  {
    id: "bloque_13",
    bloque_id: "13",
    dia_semana: 3, // Miércoles
    hora_inicio: "11:20",
    hora_fin: "12:50"
  },
  {
    id: "bloque_14",
    bloque_id: "14",
    dia_semana: 3, // Miércoles
    hora_inicio: "14:00",
    hora_fin: "15:30"
  },
  
  // JUEVES
  {
    id: "bloque_15",
    bloque_id: "15",
    dia_semana: 4, // Jueves
    hora_inicio: "08:00",
    hora_fin: "09:30"
  },
  {
    id: "bloque_16",
    bloque_id: "16",
    dia_semana: 4, // Jueves
    hora_inicio: "09:40",
    hora_fin: "11:10"
  },
  {
    id: "bloque_17",
    bloque_id: "17",
    dia_semana: 4, // Jueves
    hora_inicio: "14:00",
    hora_fin: "15:30"
  },
  {
    id: "bloque_18",
    bloque_id: "18",
    dia_semana: 4, // Jueves
    hora_inicio: "15:40",
    hora_fin: "17:10"
  },
  
  // VIERNES
  {
    id: "bloque_19",
    bloque_id: "19",
    dia_semana: 5, // Viernes
    hora_inicio: "08:00",
    hora_fin: "09:30"
  },
  {
    id: "bloque_20",
    bloque_id: "20",
    dia_semana: 5, // Viernes
    hora_inicio: "10:00",
    hora_fin: "11:30"
  },
  {
    id: "bloque_21",
    bloque_id: "21",
    dia_semana: 5, // Viernes
    hora_inicio: "11:40",
    hora_fin: "13:10"
  },
  {
    id: "bloque_22",
    bloque_id: "22",
    dia_semana: 5, // Viernes
    hora_inicio: "14:00",
    hora_fin: "15:30"
  },
  
  // SÁBADO (para laboratorios y clases especiales)
  {
    id: "bloque_23",
    bloque_id: "23",
    dia_semana: 6, // Sábado
    hora_inicio: "09:00",
    hora_fin: "12:00"
  },
  {
    id: "bloque_24",
    bloque_id: "24",
    dia_semana: 6, // Sábado
    hora_inicio: "14:00",
    hora_fin: "17:00"
  }
];

export const seccionesMock: Seccion[] = [
  {
    id: 1,
    seccion_id: "seccion_1",
    codigo: "MAT1105-2025-1",
    anio: 2025,
    semestre: 1,
    asignatura_id: 1, // Referencia numérica según types/index.ts
    asignatura_codigo: "MAT1105",
    cupos: 45
  },
  {
    id: 2,
    seccion_id: "seccion_2",
    codigo: "FIS1001-2025-1",
    anio: 2025,
    semestre: 1,
    asignatura_id: 3,
    asignatura_codigo: "FIS1001",
    cupos: 40
  },
  {
    id: 3,
    seccion_id: "seccion_3", 
    codigo: "QUI2001-2025-1",
    anio: 2025,
    semestre: 1,
    asignatura_id: 4,
    asignatura_codigo: "QUI2001",
    cupos: 30
  },
  {
    id: 4,
    seccion_id: "seccion_4",
    codigo: "INF1001-2025-1", 
    anio: 2025,
    semestre: 1,
    asignatura_id: 2,
    asignatura_codigo: "INF1001",
    cupos: 35
  }
];

export const clasesMock: Clase[] = [
  // CLASES EDIFICIO CJP07 - LUNES
  {
    id: "clase_1",
    clase_id: "clase_1",
    seccion_id: "seccion_1",
    docente_rut: "12345678-9",
    sala_codigo: "CJP07_101",
    bloque_id: "1", // Lunes 08:00-09:30
    estado: "Activo" as const
  },
  {
    id: "clase_2", 
    clase_id: "clase_2",
    seccion_id: "seccion_2",
    docente_rut: "23456789-0", 
    sala_codigo: "CJP07_102",
    bloque_id: "3", // Lunes 11:20-12:50
    estado: "Activo" as const
  },
  {
    id: "clase_3",
    clase_id: "clase_3",
    seccion_id: "seccion_3",
    docente_rut: "34567890-1",
    sala_codigo: "CJP07_201",
    bloque_id: "4", // Lunes 14:00-15:30
    estado: "Programado" as const
  },
  
  // CLASES EDIFICIO CJP07 - MARTES
  {
    id: "clase_4",
    clase_id: "clase_4", 
    seccion_id: "seccion_1",
    docente_rut: "12345678-9",
    sala_codigo: "CJP07_101",
    bloque_id: "7", // Martes 09:40-11:10
    estado: "Activo" as const
  },
  {
    id: "clase_5",
    clase_id: "clase_5",
    seccion_id: "seccion_4",
    docente_rut: "45678901-2",
    sala_codigo: "CJP07_LAB1",
    bloque_id: "8", // Martes 11:20-12:50
    estado: "Activo" as const
  },
  {
    id: "clase_6",
    clase_id: "clase_6",
    seccion_id: "seccion_2",
    docente_rut: "23456789-0",
    sala_codigo: "CJP07_102",
    bloque_id: "9", // Martes 14:00-15:30
    estado: "Programado" as const
  },
  
  // CLASES EDIFICIO CJP07 - MIÉRCOLES
  {
    id: "clase_7",
    clase_id: "clase_7",
    seccion_id: "seccion_3",
    docente_rut: "34567890-1",
    sala_codigo: "CJP07_201",
    bloque_id: "11", // Miércoles 08:00-09:30
    estado: "Activo" as const
  },
  {
    id: "clase_8",
    clase_id: "clase_8",
    seccion_id: "seccion_1",
    docente_rut: "12345678-9",
    sala_codigo: "CJP07_101",
    bloque_id: "12", // Miércoles 09:40-11:10
    estado: "Activo" as const
  },
  {
    id: "clase_9",
    clase_id: "clase_9",
    seccion_id: "seccion_4",
    docente_rut: "45678901-2",
    sala_codigo: "CJP07_LAB2",
    bloque_id: "14", // Miércoles 14:00-15:30
    estado: "Activo" as const
  },
  
  // CLASES EDIFICIO CJP07 - JUEVES
  {
    id: "clase_10",
    clase_id: "clase_10",
    seccion_id: "seccion_2",
    docente_rut: "23456789-0",
    sala_codigo: "CJP07_102",
    bloque_id: "15", // Jueves 08:00-09:30
    estado: "Activo" as const
  },
  {
    id: "clase_11",
    clase_id: "clase_11",
    seccion_id: "seccion_3",
    docente_rut: "34567890-1",
    sala_codigo: "CJP07_201",
    bloque_id: "17", // Jueves 14:00-15:30
    estado: "Programado" as const
  },
  {
    id: "clase_12",
    clase_id: "clase_12",
    seccion_id: "seccion_1",
    docente_rut: "12345678-9",
    sala_codigo: "CJP07_101",
    bloque_id: "18", // Jueves 15:40-17:10
    estado: "Activo" as const
  },
  
  // CLASES EDIFICIO CJP07 - VIERNES
  {
    id: "clase_13",
    clase_id: "clase_13",
    seccion_id: "seccion_4",
    docente_rut: "45678901-2",
    sala_codigo: "CJP07_LAB1",
    bloque_id: "19", // Viernes 08:00-09:30
    estado: "Activo" as const
  },
  {
    id: "clase_14",
    clase_id: "clase_14",
    seccion_id: "seccion_2",
    docente_rut: "23456789-0",
    sala_codigo: "CJP07_102",
    bloque_id: "20", // Viernes 10:00-11:30
    estado: "Activo" as const
  },
  {
    id: "clase_15",
    clase_id: "clase_15",
    seccion_id: "seccion_3",
    docente_rut: "34567890-1",
    sala_codigo: "CJP07_201",
    bloque_id: "22", // Viernes 14:00-15:30
    estado: "Programado" as const
  },
  
  // CLASES EDIFICIO CJP07 - SÁBADO (Laboratorios especiales)
  {
    id: "clase_16",
    clase_id: "clase_16",
    seccion_id: "seccion_4",
    docente_rut: "45678901-2",
    sala_codigo: "CJP07_LAB2",
    bloque_id: "23", // Sábado 09:00-12:00
    estado: "Programado" as const
  }
];

export const horariosManualMock: HorarioManual[] = [
  {
    id: "horario_1",
    salaId: "CJP07_101",
    titulo: "Nivelación Matemáticas",
    descripcion: "Clase de apoyo para estudiantes con dificultades en matemáticas",
    dia: "Lunes",
    horaInicio: "18:00",
    horaFin: "19:30",
    profesorId: "prof_1",
    color: "#3B82F6",
    estado: "activo",
    fechaCreacion: "2025-01-20",
    creadoPor: "admin",
    recurrente: true,
    fechaInicio: "2025-01-22",
    fechaFin: "2025-05-20"
  },
  {
    id: "horario_2",
    salaId: "CJP07_LAB1",
    titulo: "Taller de Programación",
    descripcion: "Taller práctico de programación para reforzar conceptos",
    dia: "Miércoles",
    horaInicio: "17:00",
    horaFin: "18:30",
    profesorId: "prof_2",
    color: "#10B981",
    estado: "activo",
    fechaCreacion: "2025-02-01",
    creadoPor: "admin",
    recurrente: true,
    fechaInicio: "2025-02-05",
    fechaFin: "2025-06-25"
  },
  {
    id: "horario_3",
    salaId: "CJP07_102",
    titulo: "Consulta Académica Física",
    descripcion: "Horario de consulta para dudas de física",
    dia: "Viernes",
    horaInicio: "16:00",
    horaFin: "17:00",
    profesorId: "prof_3",
    color: "#F59E0B",
    estado: "activo",
    fechaCreacion: "2025-02-10",
    creadoPor: "prof_3",
    recurrente: true,
    fechaInicio: "2025-02-14",
    fechaFin: "2025-05-30"
  },
  {
    id: "horario_4",
    salaId: "CJP07_LAB2",
    titulo: "Laboratorio Extra Química",
    descripcion: "Sesión de laboratorio adicional para experimentos avanzados",
    dia: "Sábado",
    horaInicio: "10:00",
    horaFin: "12:00",
    profesorId: "prof_4",
    color: "#8B5CF6",
    estado: "activo",
    fechaCreacion: "2025-02-15",
    creadoPor: "prof_4",
    recurrente: false,
    fechaInicio: "2025-03-01",
    fechaFin: "2025-03-01"
  }
];

export const restriccionesMock: RestriccionAcademica[] = [
  {
    id: "rest_1",
    tipo: "prerrequisito",
    descripcion: "Cálculo I es prerrequisito obligatorio para Física General I",
    activa: true,
    prioridad: "alta",
    parametros: {
      asignaturaOrigen: "MAT1105",
      asignaturaDestino: "FIS1201"
    },
    mensaje: "El estudiante debe haber aprobado Cálculo I antes de inscribir Física General I",
    fechaCreacion: "2024-01-15",
    creadoPor: "admin"
  }
];