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

export const edificiosMock: Edificio[] = [
  {
    id: "edif_1",
    nombre: "Edificio de Ciencias",
    codigo: "CS01",
    campus_codigo: "CP",
    direccion: "Av. Universidad 123",
    salas: [
      {
        id: "sala_cs_101",
        codigo: "CS01_125",
        numero: "125",
        edificioId: "edif_1",
        edificio_codigo: "CS01",
        capacidad: 40,
        tipo: "ATC",
        piso: 1,
        estado: "DISPONIBLE",
        equipamiento: ["Proyector", "Pizarra", "Sistema de audio"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_cs_102",
        codigo: "CS01_130",
        numero: "130",
        edificioId: "edif_1",
        edificio_codigo: "CS01",
        capacidad: 30,
        tipo: "LAB",
        piso: 1,
        estado: "DISPONIBLE",
        equipamiento: ["Computadores", "Proyector", "Pizarra digital"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_cs_201",
        codigo: "CS01_201",
        numero: "201",
        edificioId: "edif_1",
        edificio_codigo: "CS01",
        capacidad: 60,
        tipo: "ATC",
        piso: 2,
        estado: "DISPONIBLE",
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
    campus_codigo: "CP",
    direccion: "Av. Tecnología 456",
    salas: [
      {
        id: "sala_ing_101",
        codigo: "FAUD_204",
        numero: "204",
        edificioId: "edif_2",
        edificio_codigo: "FAUD",
        capacidad: 45,
        tipo: "TALLER",
        piso: 2,
        estado: "DISPONIBLE",
        equipamiento: ["Proyector", "Pizarra", "Aire acondicionado"],
        disponible: true,
        horarios: []
      },
      {
        id: "sala_ing_lab1",
        codigo: "FAUD_LAB1",
        numero: "LAB1",
        edificioId: "edif_2",
        edificio_codigo: "FAUD",
        capacidad: 25,
        tipo: "LAB",
        piso: 1,
        estado: "DISPONIBLE",
        equipamiento: ["30 Computadores", "Proyector", "Software especializado"],
        disponible: true,
        horarios: []
      }
    ]
  },
  {
    id: "edif_3",
    nombre: "Edificio Central",
    codigo: "CC",
    campus_codigo: "CS",
    direccion: "Plaza Central s/n",
    salas: [
      {
        id: "sala_cc_aula1",
        codigo: "CC_AULA1",
        numero: "AULA1",
        edificioId: "edif_3",
        edificio_codigo: "CC",
        capacidad: 80,
        tipo: "ATC",
        piso: 1,
        estado: "DISPONIBLE",
        equipamiento: ["Proyector", "Sistema de audio", "Pizarra"],
        disponible: true,
        horarios: []
      }
    ]
  }
];

export const asignaturasMock: Asignatura[] = [
  {
    id: "asig_1",
    codigo: "MAT1105-07",
    nombre: "Cálculo I",
    creditos: 6,
    semestre: 1,
    carrera: "Ingeniería Civil",
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
    codigo: "INF1101-02",
    nombre: "Introducción a la Programación",
    creditos: 6,
    semestre: 1,
    carrera: "Ingeniería en Informática",
    profesorId: "prof_2",
    salaId: "sala_ing_lab1",
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
    codigo: "FIS1201-01",
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
    prerrequisitos: ["MAT1105-07"],
    cupos: 30,
    inscritos: 28,
    estado: "programada",
    descripcion: "Mecánica clásica y ondas"
  },
  {
    id: "asig_4",
    codigo: "QUI1201-03",
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
    codigo: "MAT2205-01",
    nombre: "Cálculo II",
    creditos: 6,
    semestre: 2,
    carrera: "Ingeniería Civil",
    profesorId: "prof_1",
    horarios: [
      { dia: "Martes", horaInicio: "14:00", horaFin: "15:30" },
      { dia: "Jueves", horaInicio: "14:00", horaFin: "15:30" }
    ],
    prerrequisitos: ["MAT1105-07"],
    cupos: 35,
    inscritos: 0,
    estado: "planificada",
    descripcion: "Cálculo multivariable y ecuaciones diferenciales"
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
      asignaturaOrigen: "MAT1105-07",
      asignaturaDestino: "FIS1201-01"
    },
    mensaje: "El estudiante debe haber aprobado Cálculo I antes de inscribir Física General I",
    fechaCreacion: "2024-01-15",
    creadoPor: "admin"
  },
  {
    id: "rest_2",
    tipo: "sala_prohibida",
    descripcion: "Química General no puede dictarse en salas de computación",
    activa: true,
    prioridad: "media",
    parametros: {
      asignaturaOrigen: "QUI1201-03",
      salaProhibida: "sala_computacion"
    },
    mensaje: "Las clases de Química requieren laboratorio especializado, no salas de computación",
    fechaCreacion: "2024-01-10",
    creadoPor: "admin"
  },
  {
    id: "rest_3",
    tipo: "horario_conflicto",
    descripcion: "No se pueden programar clases de laboratorio después de las 16:00",
    activa: true,
    prioridad: "media",
    parametros: {
      diaRestriccion: "todos",
      horaInicioRestriccion: "16:00",
      horaFinRestriccion: "23:59"
    },
    mensaje: "Los laboratorios deben programarse antes de las 16:00 por seguridad",
    fechaCreacion: "2024-01-05",
    creadoPor: "admin"
  },
  {
    id: "rest_4",
    tipo: "profesor_especialidad",
    descripcion: "Solo profesores con especialidad en Matemáticas pueden dictar Cálculo",
    activa: true,
    prioridad: "alta",
    parametros: {
      asignaturaOrigen: "MAT1105-07",
      especialidadRequerida: "Matemáticas"
    },
    mensaje: "El profesor debe tener especialidad en Matemáticas para dictar materias de cálculo",
    fechaCreacion: "2024-01-12",
    creadoPor: "admin"
  },
  {
    id: "rest_5",
    tipo: "secuencia_temporal",
    descripcion: "Cálculo II solo puede ofrecerse después de Cálculo I",
    activa: true,
    prioridad: "alta",
    parametros: {
      asignaturaOrigen: "MAT1105-07",
      asignaturaDestino: "MAT2205-01"
    },
    mensaje: "Cálculo II es una continuación directa de Cálculo I",
    fechaCreacion: "2024-01-08",
    creadoPor: "admin"
  }
];

export const horariosManualMock: HorarioManual[] = [
  {
    id: "horario_1",
    salaId: "sala_cs_101",
    titulo: "Clase de Nivelación Matemáticas",
    descripcion: "Clase de apoyo para estudiantes con dificultades en matemáticas",
    dia: "Lunes",
    horaInicio: "18:00",
    horaFin: "19:30",
    profesorId: "prof_1",
    color: "#3B82F6",
    estado: "activo",
    fechaCreacion: "2024-01-20",
    creadoPor: "admin",
    recurrente: true,
    fechaInicio: "2024-01-22",
    fechaFin: "2024-05-20"
  },
  {
    id: "horario_2",
    salaId: "sala_ing_lab1",
    titulo: "Taller de Programación Avanzada",
    descripcion: "Taller extracurricular de programación para estudiantes avanzados",
    dia: "Viernes",
    horaInicio: "16:00",
    horaFin: "18:00",
    profesorId: "prof_2",
    color: "#10B981",
    estado: "activo",
    fechaCreacion: "2024-01-18",
    creadoPor: "admin",
    recurrente: true,
    fechaInicio: "2024-01-19",
    fechaFin: "2024-04-26"
  },
  {
    id: "horario_3",
    salaId: "sala_cs_201",
    titulo: "Conferencia Magistral",
    descripcion: "Conferencia sobre nuevas tecnologías en educación",
    dia: "Miércoles",
    horaInicio: "19:00",
    horaFin: "20:30",
    profesorId: "prof_3",
    color: "#8B5CF6",
    estado: "activo",
    fechaCreacion: "2024-01-15",
    creadoPor: "admin",
    recurrente: false,
    fechaInicio: "2024-02-14",
    fechaFin: "2024-02-14"
  },
  {
    id: "horario_4",
    salaId: "sala_cs_102",
    titulo: "Laboratorio Libre",
    descripcion: "Tiempo libre para que estudiantes practiquen experimentos",
    dia: "Sábado",
    horaInicio: "09:00",
    horaFin: "12:00",
    color: "#F59E0B",
    estado: "activo",
    fechaCreacion: "2024-01-12",
    creadoPor: "admin",
    recurrente: true,
    fechaInicio: "2024-01-20",
    fechaFin: "2024-06-15"
  },
  {
    id: "horario_5",
    salaId: "sala_cc_aula1",
    titulo: "Reunión de Coordinación",
    descripcion: "Reunión semanal del cuerpo docente",
    dia: "Martes",
    horaInicio: "12:00",
    horaFin: "13:00",
    color: "#EF4444",
    estado: "activo",
    fechaCreacion: "2024-01-10",
    creadoPor: "admin",
    recurrente: true,
    fechaInicio: "2024-01-16",
    fechaFin: "2024-12-17"
  }
];

// Datos mock basados en el diagrama de base de datos

export const campusMock: Campus[] = [
  {
    id: "campus_1",
    codigo: "CP",
    nombre: "Campus Principal"
  },
  {
    id: "campus_2", 
    codigo: "CS",
    nombre: "Campus Sur"
  }
];

export const bloquesMock: Bloque[] = [
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
    dia_semana: 2, // Martes
    hora_inicio: "08:00", 
    hora_fin: "09:30"
  },
  {
    id: "bloque_5",
    bloque_id: "5",
    dia_semana: 2, // Martes
    hora_inicio: "09:40",
    hora_fin: "11:10"
  },
  {
    id: "bloque_6",
    bloque_id: "6",
    dia_semana: 3, // Miércoles
    hora_inicio: "08:00",
    hora_fin: "09:30"
  },
  {
    id: "bloque_7",
    bloque_id: "7",
    dia_semana: 4, // Jueves
    hora_inicio: "14:00",
    hora_fin: "15:30"
  },
  {
    id: "bloque_8",
    bloque_id: "8",
    dia_semana: 5, // Viernes
    hora_inicio: "10:00",
    hora_fin: "11:30"
  }
];

export const seccionesMock: Seccion[] = [
  {
    id: "seccion_1",
    seccion_id: "seccion_1",
    numero: "paralelo: 1-2-3",
    codigo: "MAT1105-2025-1",
    ano: 2025,
    semestre: 1,
    asignatura_codigo: "MAT1105",
    cupos: 45
  },
  {
    id: "seccion_2", 
    seccion_id: "seccion_2",
    numero: "paralelo: 1-2",
    codigo: "FIS1001-2025-1",
    ano: 2025,
    semestre: 1,
    asignatura_codigo: "FIS1001",
    cupos: 40
  },
  {
    id: "seccion_3",
    seccion_id: "seccion_3", 
    numero: "paralelo: 1",
    codigo: "QUI2001-2025-1",
    ano: 2025,
    semestre: 1,
    asignatura_codigo: "QUI2001",
    cupos: 30
  },
  {
    id: "seccion_4",
    seccion_id: "seccion_4",
    numero: "paralelo: 1-2-3-4",
    codigo: "INF1001-2025-1", 
    ano: 2025,
    semestre: 1,
    asignatura_codigo: "INF1001",
    cupos: 35
  }
];

export const clasesMock: Clase[] = [
  {
    id: "clase_1",
    clase_id: "clase_1",
    seccion_id: "seccion_1",
    docente_rut: "12345678-9",
    sala_codigo: "CS01_125",
    bloque_id: "1",
    estado: "Programado" as const
  },
  {
    id: "clase_2", 
    clase_id: "clase_2",
    seccion_id: "seccion_1",
    docente_rut: "12345678-9", 
    sala_codigo: "CS01_125",
    bloque_id: "2",
    estado: "Activo" as const
  },
  {
    id: "clase_3",
    clase_id: "clase_3",
    seccion_id: "seccion_2",
    docente_rut: "23456789-0",
    sala_codigo: "FAUD_204",
    bloque_id: "3",
    estado: "Programado" as const
  },
  {
    id: "clase_4",
    clase_id: "clase_4", 
    seccion_id: "seccion_3",
    docente_rut: "34567890-1",
    sala_codigo: "CS01_125",
    bloque_id: "4",
    estado: "ETC" as const
  },
  {
    id: "clase_5",
    clase_id: "clase_5",
    seccion_id: "seccion_4",
    docente_rut: "23456789-0",
    sala_codigo: "FAUD_204", 
    bloque_id: "5",
    estado: "Activo" as const
  },
  {
    id: "clase_6",
    clase_id: "clase_6",
    seccion_id: "seccion_1",
    docente_rut: "12345678-9",
    sala_codigo: "CS01_125",
    bloque_id: "6",
    estado: "Programado" as const
  },
  {
    id: "clase_7",
    clase_id: "clase_7",
    seccion_id: "seccion_2", 
    docente_rut: "34567890-1",
    sala_codigo: "FAUD_204",
    bloque_id: "7",
    estado: "Activo" as const
  },
  {
    id: "clase_8",
    clase_id: "clase_8",
    seccion_id: "seccion_4",
    docente_rut: "23456789-0",
    sala_codigo: "CS01_125",
    bloque_id: "8",
    estado: "Programado" as const
  }
];