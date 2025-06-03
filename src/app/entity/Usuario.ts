export interface Usuario {
  nome: string;
  senha: string;
  role: 'estudante' | 'funcionario';
}