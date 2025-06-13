import { Local } from "./Local";

export interface Disponibilidade {
  _id: string;
  local: Local;
  diaDaSemana: number;
  horarioInicio: string;
  horarioFinal: string;   
  estaDisponivel: boolean;
}