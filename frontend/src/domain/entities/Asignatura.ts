export interface Asignatura {
  id: string;
  codigo: string;
  nombre: string;
  carrera: string;
  estado?: string; //  'programada'
  semestre?: number;
  prerrequisitos: string[]; // codigos
  salaId?: string;
  inscritos?: number;
}
