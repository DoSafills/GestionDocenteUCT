export interface Docente {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
  esta_activo: boolean;
  especialidad: string; 
}