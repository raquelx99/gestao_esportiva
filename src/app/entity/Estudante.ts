import { Usuario } from './Usuario';

export interface Estudante {
  user: Usuario;
  matricula: string;
  curso: string;
  centro: string;
  telefone: string;
  telefoneUrgencia: string;
  semestreInicio: Date | null;
}