import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspacoHorario, MOCK_ESPACOS_HORARIOS, HorarioSlot } from '../../../core/mocks/mock-horarios'; // Ou mock-carteiras.ts

// Interface para representar um slot de horário fixo com sua descrição
interface SlotFixo {
  id: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
  bloco: 'AB' | 'CD' | 'EF';
  descricao: string;
}

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit {
  listaCompletaEspacos: EspacoHorario[] = [];
  espacosFiltrados: EspacoHorario[] = [];

  diasDaSemanaCabecalho: string[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  slotsFixosPorPeriodo: { periodo: string, slots: SlotFixo[] }[] = [
    { periodo: 'Manhã', slots: [
      { id: 'M_AB', periodo: 'Manhã', bloco: 'AB', descricao: '07:30 - 09:10' },
      { id: 'M_CD', periodo: 'Manhã', bloco: 'CD', descricao: '09:30 - 11:10' },
      { id: 'M_EF', periodo: 'Manhã', bloco: 'EF', descricao: '11:20 - 13:00' }
    ]},
    { periodo: 'Tarde', slots: [
      { id: 'T_AB', periodo: 'Tarde', bloco: 'AB', descricao: '13:30 - 15:10' },
      { id: 'T_CD', periodo: 'Tarde', bloco: 'CD', descricao: '15:20 - 17:10' },
      { id: 'T_EF', periodo: 'Tarde', bloco: 'EF', descricao: '17:10 - 19:00' }
    ]},
    { periodo: 'Noite', slots: [
      { id: 'N_AB', periodo: 'Noite', bloco: 'AB', descricao: '19:00 - 20:40' },
      { id: 'N_CD', periodo: 'Noite', bloco: 'CD', descricao: '21:00 - 22:40' }
    ]}
  ];

  todosOsSlotsFixos: SlotFixo[] = []; // Mantém a declaração

  constructor() { }

  ngOnInit(): void {
    // CORREÇÃO APLICADA AQUI:
    this.todosOsSlotsFixos = this.slotsFixosPorPeriodo.flatMap(periodo => periodo.slots);

    this.listaCompletaEspacos = MOCK_ESPACOS_HORARIOS.map(espaco => ({
      ...espaco,
      isExpanded: espaco.isExpanded || false
    }));
    this.filtrarEspacos('');
    console.log('Espaços e horários carregados:', this.listaCompletaEspacos);
    console.log('Todos os slots fixos para a tabela:', this.todosOsSlotsFixos); // Bom para depurar
  }

  toggleDetalhesEspaco(espaco: EspacoHorario): void {
    espaco.isExpanded = !espaco.isExpanded;
  }

  filtrarEspacos(termoBuscaInput: string): void {
    const termo = termoBuscaInput.trim().toLowerCase();
    if (!termo) {
      this.espacosFiltrados = [...this.listaCompletaEspacos];
    } else {
      this.espacosFiltrados = this.listaCompletaEspacos.filter(e =>
        e.nomeDisplay.toLowerCase().includes(termo)
      );
    }
  }

  getStatusSlot(espaco: EspacoHorario, diaNome: string, slotFixo: SlotFixo): string {
    const diaEncontrado = espaco.horarios.find(d => d.nome === diaNome);
    if (diaEncontrado) {
      const slotEncontrado = diaEncontrado.slots.find(s => s.hora === slotFixo.descricao);
      return slotEncontrado ? slotEncontrado.status : ' ';
    }
    return ' ';
  }
}