export interface HorarioSlot {
  hora: string; // Ex: "07:30 - 09:10" (deve corresponder ao SlotFixo.descricao)
  status: string; // Ex: "Livre", "Reservado - Futsal", "Manutenção"
}

export interface DiaDaSemana {
  nome: string; // Ex: "Segunda"
  slots: HorarioSlot[];
}

export interface EspacoHorario {
  id: string;
  nomeDisplay: string;
  horarios: DiaDaSemana[];
  isExpanded?: boolean;
  isEditing?: boolean;
}

export const MOCK_ESPACOS_HORARIOS: EspacoHorario[] = [
  {
    id: 'quadra-a',
    nomeDisplay: 'QUADRA A',
    isExpanded: false,
    horarios: [
      { nome: 'Segunda', slots: [
          { hora: '07:30 - 09:10', status: 'Livre' },             // Era '08:00 - 09:00' -> Mapeado para Manhã AB
          { hora: '09:30 - 11:10', status: 'Reservado - Vôlei' }  // Era '09:00 - 10:00' -> Mapeado para Manhã CD
        ]
      },
      { nome: 'Terça', slots: [
          { hora: '07:30 - 09:10', status: 'Manutenção' },         // Era '08:00 - 09:00' -> Mapeado para Manhã AB
          { hora: '13:30 - 15:10', status: 'Livre' }              // Era '14:00 - 15:00' -> Mapeado para Tarde AB
        ]
      },
      { nome: 'Quarta', slots: [
          { hora: '09:30 - 11:10', status: 'Livre' }              // Era '10:00 - 11:00' -> Mapeado para Manhã CD
        ]
      },
      { nome: 'Quinta', slots: [
          { hora: '07:30 - 09:10', status: 'Reservado - Basquete' } // Era '08:00 - 09:00' -> Mapeado para Manhã AB
        ]
      },
      { nome: 'Sexta', slots: [
          { hora: '15:20 - 17:10', status: 'Livre' }              // Era '16:00 - 17:00' -> Mapeado para Tarde CD
        ]
      }
      // Você pode adicionar entradas para Sábado e Domingo se quiser, ou outros slots.
      // Ex: { nome: 'Sábado', slots: [ { hora: '09:30 - 11:10', status: 'Livre' } ] },
    ]
  },
  {
    id: 'quadra-b',
    nomeDisplay: 'QUADRA B',
    isExpanded: false,
    horarios: [
      { nome: 'Segunda', slots: [
          { hora: '09:30 - 11:10', status: 'Reservado - Handebol' } // Era '10:00 - 11:00' -> Mapeado para Manhã CD
        ]
      },
      { nome: 'Terça', slots: [
          { hora: '11:20 - 13:00', status: 'Livre' }                  // Era '11:00 - 12:00' -> Mapeado para Manhã EF
        ]
      },
      { nome: 'Quarta', slots: [
          { hora: '07:30 - 09:10', status: 'Livre' },                 // Era '08:00 - 09:00' -> Mapeado para Manhã AB
          { hora: '09:30 - 11:10', status: 'Manutenção' }             // Era '09:00 - 10:00' -> Mapeado para Manhã CD
        ]
      },
      { nome: 'Quinta', slots: [
          { hora: '15:20 - 17:10', status: 'Livre' }                  // Era '15:00 - 16:00' -> Mapeado para Tarde CD (assumindo que ocupa este bloco)
        ]
      },
      { nome: 'Sexta', slots: [
          { hora: '09:30 - 11:10', status: 'Reservado - Futsal' }     // Era '10:00 - 11:00' -> Mapeado para Manhã CD
        ]
      }
    ]
  }
  // Adicione mais espaços (Piscina, etc.) se desejar, seguindo o mesmo modelo.
];