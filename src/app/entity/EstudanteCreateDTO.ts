export interface EstudanteCreateDTO {
  nome: string;
  senha: string;
  matricula: string;
  role: 'estudante';
  curso: string;
  centro: string;
  telefone: string;
  telefoneUrgencia: string;
}