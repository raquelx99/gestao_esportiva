export interface EstudanteCreateDTO {
  nome: string;
  senha: string;
  role: 'estudante';
  matricula: string;
  curso: string;
  centro: string;
  telefone: string;
  telefoneUrgencia: string;
}