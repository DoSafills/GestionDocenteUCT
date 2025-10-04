import type { Curso } from '../types';

export const cursosDisponibles: Curso[] = [
  {
    id: '1',
    nombre: 'Introducción a la Programación',
    descripcion: 'Aprende los fundamentos de la programación con Python',
    instructor: 'María González',
    duracion: '8 semanas',
    precio: 299,
    cuposDisponibles: 15,
    cuposTotal: 25,
    fechaInicio: '2025-10-15',
    fechaFinInscripcion: '2025-10-10',
    nivel: 'Principiante',
    restricciones: {
      edadMinima: 16,
      documentosRequeridos: ['Cédula de identidad', 'Certificado de estudios']
    },
    imagen: 'programming basics'
  },
  {
    id: '2',
    nombre: 'Desarrollo Web Frontend',
    descripcion: 'Domina HTML, CSS, JavaScript y React para crear aplicaciones web modernas',
    instructor: 'Carlos Ruiz',
    duracion: '12 semanas',
    precio: 599,
    cuposDisponibles: 8,
    cuposTotal: 20,
    fechaInicio: '2025-11-01',
    fechaFinInscripcion: '2025-10-25',
    nivel: 'Intermedio',
    restricciones: {
      edadMinima: 18,
      prerrequisitos: ['Introducción a la Programación'],
      nivelMinimo: 'Intermedio',
      experienciaMinima: '6 meses de programación',
      documentosRequeridos: ['Cédula de identidad', 'Certificado de curso previo']
    },
    imagen: 'web development'
  },
  {
    id: '3',
    nombre: 'Ciencia de Datos con Python',
    descripcion: 'Análisis de datos, machine learning y visualización con Python',
    instructor: 'Ana Martínez',
    duracion: '16 semanas',
    precio: 799,
    cuposDisponibles: 3,
    cuposTotal: 15,
    fechaInicio: '2025-11-15',
    fechaFinInscripcion: '2025-11-05',
    nivel: 'Avanzado',
    restricciones: {
      edadMinima: 20,
      edadMaxima: 45,
      prerrequisitos: ['Introducción a la Programación', 'Estadística Básica'],
      nivelMinimo: 'Avanzado',
      experienciaMinima: '2 años de programación',
      documentosRequeridos: ['Cédula de identidad', 'Título universitario', 'Portfolio de proyectos']
    },
    imagen: 'data science'
  },
  {
    id: '4',
    nombre: 'Diseño UX/UI',
    descripcion: 'Aprende a diseñar experiencias de usuario intuitivas y atractivas',
    instructor: 'Luis Fernández',
    duracion: '10 semanas',
    precio: 499,
    cuposDisponibles: 12,
    cuposTotal: 18,
    fechaInicio: '2025-10-20',
    fechaFinInscripcion: '2025-10-15',
    nivel: 'Principiante',
    restricciones: {
      edadMinima: 17,
      documentosRequeridos: ['Cédula de identidad']
    },
    imagen: 'ux ui design'
  },
  {
    id: '5',
    nombre: 'Marketing Digital Avanzado',
    descripcion: 'Estrategias avanzadas de marketing digital y análisis de ROI',
    instructor: 'Patricia Silva',
    duracion: '6 semanas',
    precio: 399,
    cuposDisponibles: 0,
    cuposTotal: 12,
    fechaInicio: '2025-10-25',
    fechaFinInscripcion: '2025-10-20',
    nivel: 'Intermedio',
    restricciones: {
      edadMinima: 21,
      experienciaMinima: '1 año en marketing o ventas',
      documentosRequeridos: ['Cédula de identidad', 'Experiencia laboral certificada']
    },
    imagen: 'digital marketing'
  }
];

export const cursosCompletadosEjemplo = [
  'Introducción a la Programación',
  'Estadística Básica',
  'HTML y CSS Básico'
];