import { Estudante } from './Estudante';

export interface Carteirinha {
  _id?: string;
  estudante: Estudante;
  validade: Date;
  espacos: string[];
  status: 'pendente' | 'aprovado' | 'rejeitada';
  liberadoPosValidacao: boolean;
}