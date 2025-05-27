export interface HorarioSlot {
  hora: string; // Ex: "08:00 - 09:00"
  status: string; // Ex: "Livre", "Reservado - Futsal", "Manutenção"
}

export interface DiaDaSemana {
  nome: string; // Ex: "Segunda"
  slots: HorarioSlot[];
}

export interface EspacoHorario {
  id: string; // Ex: 'quadra-a'
  nomeDisplay: string; // Ex: "QUADRA A"
  horarios: DiaDaSemana[];
  isExpanded?: boolean; // Para controlar a expansão
}

export const MOCK_ESPACOS_HORARIOS: EspacoHorario[] = [
  {
    id: 'quadra-a',
    nomeDisplay: 'QUADRA A',
    isExpanded: false,
    horarios: [
      { nome: 'Segunda', slots: [ { hora: '08:00 - 09:00', status: 'Livre' }, { hora: '09:00 - 10:00', status: 'Reservado - Vôlei' } ] },
      { nome: 'Terça', slots: [ { hora: '08:00 - 09:00', status: 'Manutenção' }, { hora: '14:00 - 15:00', status: 'Livre' } ] },
      { nome: 'Quarta', slots: [ { hora: '10:00 - 11:00', status: 'Livre' } ] },
      { nome: 'Quinta', slots: [ { hora: '08:00 - 09:00', status: 'Reservado - Basquete' } ] },
      { nome: 'Sexta', slots: [ { hora: '16:00 - 17:00', status: 'Livre' } ] }
    ]
  },
  {
    id: 'quadra-b',
    nomeDisplay: 'QUADRA B',
    isExpanded: false,
    horarios: [
      { nome: 'Segunda', slots: [ { hora: '10:00 - 11:00', status: 'Reservado - Handebol' } ] },
      { nome: 'Terça', slots: [ { hora: '11:00 - 12:00', status: 'Livre' } ] },
      { nome: 'Quarta', slots: [ { hora: '08:00 - 09:00', status: 'Livre' }, { hora: '09:00 - 10:00', status: 'Manutenção' } ] },
      { nome: 'Quinta', slots: [ { hora: '15:00 - 16:00', status: 'Livre' } ] },
      { nome: 'Sexta', slots: [ { hora: '10:00 - 11:00', status: 'Reservado - Futsal' } ] }
    ]
  }
];