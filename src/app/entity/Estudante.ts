import { Usuario } from './Usuario';

export interface Estudante {
  user: Usuario;
  curso: string;
  centro: string;
  telefone: string;
  telefoneUrgencia: string;
  semestreInicio: Date | null;
}