export interface CarteiraDetalhes {
  id: string;
  nome: string;
  matricula: string;
  curso: string;
  centro: string;
  cpf: string;
  telefone: string;
  telefoneUrgencia: string;
  validade: string;
  espacosSolicitados: string;
  fotoDocumentoUrl?: string;
  emissaoDetalhes?: string;
  dataRequisicao?: string;
  isExpanded?: boolean;
}