
// Datos mock para el sistema académico
import type { Profesor, Edificio, Asignatura, RestriccionAcademica, HorarioManual } from '@/types';
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
        id: 'prof_1',
        nombre: 'Carlos',
        apellido: 'Rodriguez',
        email: 'carlos.rodriguez@universidad.edu',
        telefono: '+56912345678',
        especialidad: ['Matemáticas', 'Estadística', 'Álgebra Lineal'],
        disponibilidad: {
            dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves'],
            horasInicio: '08:00',
            horasFin: '18:00',
        },
        experiencia: 15,
        estado: 'activo',
        fechaContratacion: '2010-03-15',
    },
    {
        id: 'prof_2',
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@universidad.edu',
        telefono: '+56923456789',
        especialidad: ['Programación', 'Algoritmos', 'Estructura de Datos'],
        disponibilidad: {
            dias: ['Lunes', 'Miércoles', 'Viernes'],
            horasInicio: '09:00',
            horasFin: '17:00',
        },
        experiencia: 8,
        estado: 'activo',
        fechaContratacion: '2016-08-20',
    },
    {
        id: 'prof_3',
        nombre: 'Ana',
        apellido: 'López',
        email: 'ana.lopez@universidad.edu',
        telefono: '+56934567890',
        especialidad: ['Física', 'Mecánica', 'Termodinámica'],
        disponibilidad: {
            dias: ['Martes', 'Jueves', 'Viernes'],
            horasInicio: '08:30',
            horasFin: '16:30',
        },
        experiencia: 12,
        estado: 'activo',
        fechaContratacion: '2012-01-10',
    },
    {
        id: 'prof_4',
        nombre: 'Roberto',
        apellido: 'Silva',
        email: 'roberto.silva@universidad.edu',
        telefono: '+56945678901',
        especialidad: ['Química', 'Química Orgánica', 'Laboratorio'],
        disponibilidad: {
            dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
            horasInicio: '07:00',
            horasFin: '15:00',
        },
        experiencia: 20,
        estado: 'activo',
        fechaContratacion: '2004-09-05',
    },
];

// Mock de Campus
export const campusMock = [
  {
    id: 1,
    nombre: "Campus San Juan Pablo II",
    direccion: "Av. Universidad 123"
  },
  {
    id: 2,
    nombre: "Campus Norte",
    direccion: "Av. Tecnología 456"
  }
];

// Mock de Edificios
export const edificiosMock = [
  {
    id: 1,
    nombre: "Edificio de Ciencias",
    tipo: "cientifico",
    campus_id: 1
  },
  {
    id: 2,
    nombre: "Edificio de Ingeniería",
    tipo: "ingenieria",
    campus_id: 2
  },
  {
    id: 3,
    nombre: "Edificio Central",
    tipo: "administrativo",
    campus_id: 1
  }
];

// Mock de Salas
export const salasMock = [
  {
    id: 1,
    codigo: "CS-101",
    capacidad: 40,
    tipo: "aula",
    esta_disponible: true,
    edificio_id: 1,
    equipamiento: "Proyector, Pizarra, Sistema de audio"
  },
  {
    id: 2,
    codigo: "CS-102",
    capacidad: 30,
    tipo: "laboratorio",
    esta_disponible: true,
    edificio_id: 1,
    equipamiento: "Computadores, Proyector, Pizarra digital"
  },
  {
    id: 3,
    codigo: "CS-201",
    capacidad: 60,
    tipo: "auditorio",
    esta_disponible: true,
    edificio_id: 1,
    equipamiento: "Sistema de sonido, Proyector HD, Escenario"
  },
  {
    id: 4,
    codigo: "ING-101",
    capacidad: 45,
    tipo: "aula",
    esta_disponible: true,
    edificio_id: 2,
    equipamiento: "Proyector, Pizarra, Aire acondicionado"
  },
  {
    id: 5,
    codigo: "ING-LAB1",
    capacidad: 25,
    tipo: "sala_computacion",
    esta_disponible: true,
    edificio_id: 2,
    equipamiento: "30 Computadores, Proyector, Software especializado"
  },
  {
    id: 6,
    codigo: "CC-AULA1",
    capacidad: 80,
    tipo: "aula",
    esta_disponible: true,
    edificio_id: 3,
    equipamiento: "Proyector, Sistema de audio, Pizarra"
  }
];

export const asignaturasMock: Asignatura[] = [
    {
        id: 'asig_1',
        codigo: 'MAT1105-07',
        nombre: 'Cálculo I',
        creditos: 6,
        semestre: 1,
        carrera: 'Ingeniería Civil',
        profesorId: 'prof_1',
        salaId: 'sala_cs_101',
        horarios: [
            { dia: 'Lunes', horaInicio: '08:30', horaFin: '10:00' },
            { dia: 'Miércoles', horaInicio: '08:30', horaFin: '10:00' },
            { dia: 'Viernes', horaInicio: '08:30', horaFin: '10:00' },
        ],
        prerrequisitos: [],
        cupos: 40,
        inscritos: 35,
        estado: 'programada',
        descripcion: 'Introducción al cálculo diferencial e integral',
    },
    {
        id: 'asig_2',
        codigo: 'INF1101-02',
        nombre: 'Introducción a la Programación',
        creditos: 6,
        semestre: 1,
        carrera: 'Ingeniería en Informática',
        profesorId: 'prof_2',
        salaId: 'sala_ing_lab1',
        horarios: [
            { dia: 'Martes', horaInicio: '10:15', horaFin: '12:30' },
            { dia: 'Jueves', horaInicio: '10:15', horaFin: '12:30' },
        ],
        prerrequisitos: [],
        cupos: 25,
        inscritos: 23,
        estado: 'programada',
        descripcion: 'Fundamentos de programación en Python',
    },
    {
        id: 'asig_3',
        codigo: 'FIS1201-01',
        nombre: 'Física General I',
        creditos: 6,
        semestre: 2,
        carrera: 'Ingeniería Civil',
        profesorId: 'prof_3',
        salaId: 'sala_cs_102',
        horarios: [
            { dia: 'Lunes', horaInicio: '14:00', horaFin: '15:30' },
            { dia: 'Miércoles', horaInicio: '14:00', horaFin: '15:30' },
        ],
        prerrequisitos: ['MAT1105-07'],
        cupos: 30,
        inscritos: 28,
        estado: 'programada',
        descripcion: 'Mecánica clásica y ondas',
    },
    {
        id: 'asig_4',
        codigo: 'QUI1201-03',
        nombre: 'Química General',
        creditos: 4,
        semestre: 1,
        carrera: 'Ingeniería Química',
        profesorId: 'prof_4',
        salaId: 'sala_cs_102',
        horarios: [
            { dia: 'Martes', horaInicio: '08:30', horaFin: '10:00' },
            { dia: 'Jueves', horaInicio: '08:30', horaFin: '10:00' },
        ],
        prerrequisitos: [],
        cupos: 30,
        inscritos: 25,
        estado: 'programada',
        descripcion: 'Fundamentos de química general y laboratorio',
    },
    {
        id: 'asig_5',
        codigo: 'MAT2205-01',
        nombre: 'Cálculo II',
        creditos: 6,
        semestre: 2,
        carrera: 'Ingeniería Civil',
        profesorId: 'prof_1',
        horarios: [
            { dia: 'Martes', horaInicio: '14:00', horaFin: '15:30' },
            { dia: 'Jueves', horaInicio: '14:00', horaFin: '15:30' },
        ],
        prerrequisitos: ['MAT1105-07'],
        cupos: 35,
        inscritos: 0,
        estado: 'planificada',
        descripcion: 'Cálculo multivariable y ecuaciones diferenciales',
    },
];

export const restriccionesMock: RestriccionAcademica[] = [
    {
        id: 'rest_1',
        tipo: 'prerrequisito',
        descripcion: 'Cálculo I es prerrequisito obligatorio para Física General I',
        activa: true,
        prioridad: 'alta',
        parametros: {
            asignaturaOrigen: 'MAT1105-07',
            asignaturaDestino: 'FIS1201-01',
        },
        mensaje: 'El estudiante debe haber aprobado Cálculo I antes de inscribir Física General I',
        fechaCreacion: '2024-01-15',
        creadoPor: 'admin',
    },
    {
        id: 'rest_2',
        tipo: 'sala_prohibida',
        descripcion: 'Química General no puede dictarse en salas de computación',
        activa: true,
        prioridad: 'media',
        parametros: {
            asignaturaOrigen: 'QUI1201-03',
            salaProhibida: 'sala_computacion',
        },
        mensaje: 'Las clases de Química requieren laboratorio especializado, no salas de computación',
        fechaCreacion: '2024-01-10',
        creadoPor: 'admin',
    },
    {
        id: 'rest_3',
        tipo: 'horario_conflicto',
        descripcion: 'No se pueden programar clases de laboratorio después de las 16:00',
        activa: true,
        prioridad: 'media',
        parametros: {
            diaRestriccion: 'todos',
            horaInicioRestriccion: '16:00',
            horaFinRestriccion: '23:59',
        },
        mensaje: 'Los laboratorios deben programarse antes de las 16:00 por seguridad',
        fechaCreacion: '2024-01-05',
        creadoPor: 'admin',
    },
    {
        id: 'rest_4',
        tipo: 'profesor_especialidad',
        descripcion: 'Solo profesores con especialidad en Matemáticas pueden dictar Cálculo',
        activa: true,
        prioridad: 'alta',
        parametros: {
            asignaturaOrigen: 'MAT1105-07',
            especialidadRequerida: 'Matemáticas',
        },
        mensaje: 'El profesor debe tener especialidad en Matemáticas para dictar materias de cálculo',
        fechaCreacion: '2024-01-12',
        creadoPor: 'admin',
    },
    {
        id: 'rest_5',
        tipo: 'secuencia_temporal',
        descripcion: 'Cálculo II solo puede ofrecerse después de Cálculo I',
        activa: true,
        prioridad: 'alta',
        parametros: {
            asignaturaOrigen: 'MAT1105-07',
            asignaturaDestino: 'MAT2205-01',
        },
        mensaje: 'Cálculo II es una continuación directa de Cálculo I',
        fechaCreacion: '2024-01-08',
        creadoPor: 'admin',
    },
];

export const horariosManualMock: HorarioManual[] = [
    {
        id: 'horario_1',
        salaId: 'sala_cs_101',
        titulo: 'Clase de Nivelación Matemáticas',
        descripcion: 'Clase de apoyo para estudiantes con dificultades en matemáticas',
        dia: 'Lunes',
        horaInicio: '18:00',
        horaFin: '19:30',
        profesorId: 'prof_1',
        color: '#3B82F6',
        estado: 'activo',
        fechaCreacion: '2024-01-20',
        creadoPor: 'admin',
        recurrente: true,
        fechaInicio: '2024-01-22',
        fechaFin: '2024-05-20',
    },
    {
        id: 'horario_2',
        salaId: 'sala_ing_lab1',
        titulo: 'Taller de Programación Avanzada',
        descripcion: 'Taller extracurricular de programación para estudiantes avanzados',
        dia: 'Viernes',
        horaInicio: '16:00',
        horaFin: '18:00',
        profesorId: 'prof_2',
        color: '#10B981',
        estado: 'activo',
        fechaCreacion: '2024-01-18',
        creadoPor: 'admin',
        recurrente: true,
        fechaInicio: '2024-01-19',
        fechaFin: '2024-04-26',
    },
    {
        id: 'horario_3',
        salaId: 'sala_cs_201',
        titulo: 'Conferencia Magistral',
        descripcion: 'Conferencia sobre nuevas tecnologías en educación',
        dia: 'Miércoles',
        horaInicio: '19:00',
        horaFin: '20:30',
        profesorId: 'prof_3',
        color: '#8B5CF6',
        estado: 'activo',
        fechaCreacion: '2024-01-15',
        creadoPor: 'admin',
        recurrente: false,
        fechaInicio: '2024-02-14',
        fechaFin: '2024-02-14',
    },
    {
        id: 'horario_4',
        salaId: 'sala_cs_102',
        titulo: 'Laboratorio Libre',
        descripcion: 'Tiempo libre para que estudiantes practiquen experimentos',
        dia: 'Sábado',
        horaInicio: '09:00',
        horaFin: '12:00',
        color: '#F59E0B',
        estado: 'activo',
        fechaCreacion: '2024-01-12',
        creadoPor: 'admin',
        recurrente: true,
        fechaInicio: '2024-01-20',
        fechaFin: '2024-06-15',
    },
    {
        id: 'horario_5',
        salaId: 'sala_cc_aula1',
        titulo: 'Reunión de Coordinación',
        descripcion: 'Reunión semanal del cuerpo docente',
        dia: 'Martes',
        horaInicio: '12:00',
        horaFin: '13:00',
        color: '#EF4444',
        estado: 'activo',
        fechaCreacion: '2024-01-10',
        creadoPor: 'admin',
        recurrente: true,
        fechaInicio: '2024-01-16',
        fechaFin: '2024-12-17',
    },
];
