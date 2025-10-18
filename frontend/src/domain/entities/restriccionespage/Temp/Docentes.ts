export class Docente {
  readonly docente_rut: string;
  nombre: string;
  email: string;
  pass_hash: string;
  max_horas_docencia: number;

  constructor(
    docente_rut: string,
    nombre: string,
    email: string,
    pass_hash: string,
    max_horas_docencia: number = 20
  ) {
    this.docente_rut = docente_rut;
    this.nombre = nombre;
    this.email = email;
    this.pass_hash = pass_hash;
    this.max_horas_docencia = max_horas_docencia;
  }

  // Ejemplo de método de dominio: verificar si excede horas asignadas
  puedeAsignarse(horasAsignadas: number): boolean {
    return horasAsignadas <= this.max_horas_docencia;
  }

  // Método opcional para actualizar datos del docente
  actualizarDatos(nombre: string, email: string, max_horas_docencia?: number) {
    this.nombre = nombre;
    this.email = email;
    if (max_horas_docencia !== undefined) {
      this.max_horas_docencia = max_horas_docencia;
    }
  }
}
