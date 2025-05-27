export interface CarteiraDetalhes {
  id: string;
  nome: string;
  matricula: string;
  curso: string;
  centro: string;
  cpf: string;
  telefone: string;
  email: string;
  contatoEmergenciaNome: string;
  contatoEmergenciaTel: string;
  validade: string;
  espacosSolicitados: string;
  fotoDocumentoUrl?: string;
  // Poderíamos adicionar um status 'pendente', 'aprovada', 'rejeitada' aqui no futuro
}

export const MOCK_CARTEIRAS: CarteiraDetalhes[] = [
  {
    id: '1',
    nome: 'João Eduardo Lima Sousa',
    matricula: '2320222',
    curso: 'Comércio Exterior',
    centro: 'CCG',
    cpf: '111.222.333-44',
    telefone: '85 98999-9999',
    email: 'joao.eduardo&#64;email.com',
    contatoEmergenciaNome: 'Maria Lima',
    contatoEmergenciaTel: '85 98888-8888',
    validade: '31/12/2025',
    espacosSolicitados: 'Piscina, Quadra, Society',
    fotoDocumentoUrl: 'https://via.placeholder.com/350x250.png?text=Doc+ID+1'
  },
  {
    id: '2',
    nome: 'Ciclana da Silva',
    matricula: '2320333',
    curso: 'Engenharia de Software',
    centro: 'CCT',
    cpf: '222.333.444-55',
    telefone: '85 98777-7777',
    email: 'ciclana.silva&#64;email.com',
    contatoEmergenciaNome: 'José Silva',
    contatoEmergenciaTel: '85 98666-6666',
    validade: '30/11/2025',
    espacosSolicitados: 'Quadra de Tênis, Pista de Atletismo',
    fotoDocumentoUrl: 'https://via.placeholder.com/350x250.png?text=Doc+ID+2'
  },
  {
    id: '3',
    nome: 'Beltrano Souza',
    matricula: '2320444',
    curso: 'Direito',
    centro: 'CCJ',
    cpf: '333.444.555-66',
    telefone: '85 98555-5555',
    email: 'beltrano.souza&#64;email.com',
    contatoEmergenciaNome: 'Ana Souza',
    contatoEmergenciaTel: '85 98444-4444',
    validade: '28/02/2026',
    espacosSolicitados: 'Piscina',
    fotoDocumentoUrl: 'https://via.placeholder.com/350x250.png?text=Doc+ID+3'
  }
];