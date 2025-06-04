export interface HorarioSlot {
  hora: string; // Ex: "07:30 - 09:10"
  status: string;
}

export interface DiaDaSemana {
  nome: string;
  slots: HorarioSlot[];
}

export interface EspacoHorario {
  id: string; // Usaremos para identificar a imagem também
  nomeDisplay: string;
  horarios: DiaDaSemana[];
  isExpanded?: boolean;
  isEditing?: boolean;
}

export const MOCK_ESPACOS_HORARIOS: EspacoHorario[] = [
  {
    id: 'piscina',
    nomeDisplay: 'PISCINA',
    horarios: [
      { nome: 'Segunda', slots: [{ hora: '09:30 - 11:10', status: 'Livre' }] },
      { nome: 'Quarta', slots: [{ hora: '09:30 - 11:10', status: 'Livre' }] },
      { nome: 'Sexta', slots: [{ hora: '07:30 - 09:10', status: 'Livre' }] },
    ]
  },
  {
    id: 'quadra-poliesportiva', // Um nome genérico para "Quadra"
    nomeDisplay: 'QUADRA',
    horarios: [
      { nome: 'Terça', slots: [{ hora: '13:30 - 15:10', status: 'Treino Futsal' }, { hora: '15:20 - 17:10', status: 'Livre' }] },
      { nome: 'Quinta', slots: [{ hora: '13:30 - 15:10', status: 'Treino Vôlei' }, { hora: '15:20 - 17:10', status: 'Livre' }] },
    ]
  },
  {
    id: 'campo-society',
    nomeDisplay: 'CAMPO SOCIETY',
    horarios: [
      { nome: 'Segunda', slots: [{ hora: '17:10 - 19:00', status: 'Livre' }] },
      { nome: 'Quarta', slots: [{ hora: '19:00 - 20:40', status: 'Reservado Equipe' }] },
    ]
  },
  {
    id: 'quadra-tenis',
    nomeDisplay: 'QUADRA DE TÊNIS',
    horarios: [
      { nome: 'Terça', slots: [{ hora: '09:30 - 11:10', status: 'Aula Tênis' }] },
      { nome: 'Quinta', slots: [{ hora: '09:30 - 11:10', status: 'Livre' }] },
    ]
  },
  {
    id: 'quadra-areia',
    nomeDisplay: 'QUADRA DE AREIA',
    horarios: [
      { nome: 'Sexta', slots: [{ hora: '17:10 - 19:00', status: 'Livre (Vôlei de Praia)' }] },
    ]
  },
  {
    id: 'pista-atletismo',
    nomeDisplay: 'PISTA DE ATLETISMO',
    horarios: [ // Pistas de atletismo geralmente são mais abertas
      { nome: 'Segunda', slots: [{ hora: '07:30 - 09:10', status: 'Livre' }, { hora: '17:10 - 19:00', status: 'Treino Corrida' }] },
      { nome: 'Terça', slots: [{ hora: '07:30 - 09:10', status: 'Livre' }] },
      { nome: 'Quarta', slots: [{ hora: '07:30 - 09:10', status: 'Livre' }, { hora: '17:10 - 19:00', status: 'Treino Corrida' }] },
      { nome: 'Quinta', slots: [{ hora: '07:30 - 09:10', status: 'Livre' }] },
      { nome: 'Sexta', slots: [{ hora: '07:30 - 09:10', status: 'Livre' }, { hora: '17:10 - 19:00', status: 'Treino Corrida' }] },
    ]
  }
];