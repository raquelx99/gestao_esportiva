import { Local } from "./Local";

export interface Disponibilidade {
  local: Local;
  diaDaSemana: number;
  horarioInicio: string;
  horarioFinal: string;   
  estaDisponivel: boolean;
}