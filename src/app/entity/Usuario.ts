export interface Usuario {
  nome: string;
  senha: string;
  matricula: string;
  role: 'estudante' | 'funcionario';
}