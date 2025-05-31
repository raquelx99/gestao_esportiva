import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspacoHorario, MOCK_ESPACOS_HORARIOS, HorarioSlot, DiaDaSemana } from '../../../core/mocks/mock-horarios'; 

interface SlotFixo {
  id: string; // Ex: 'M_AB', 'T_CD'
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
  todosOsSlotsFixos: SlotFixo[] = [];

  constructor() { }

  ngOnInit(): void {
    this.todosOsSlotsFixos = this.slotsFixosPorPeriodo.flatMap(periodo => periodo.slots);

    this.listaCompletaEspacos = MOCK_ESPACOS_HORARIOS.map(espaco => ({
      ...espaco,
      isExpanded: espaco.isExpanded || false,
      isEditing: false
    }));
    this.filtrarEspacos('');
    console.log('Espaços e horários carregados:', this.listaCompletaEspacos);
  }

  toggleDetalhesEspaco(espaco: EspacoHorario): void {
    espaco.isExpanded = !espaco.isExpanded;
    if (!espaco.isExpanded) {
      espaco.isEditing = false;
    }
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
    console.log('Termo buscado (horários):', termo, 'Resultados:', this.espacosFiltrados.length);
  }

  getStatusSlot(espaco: EspacoHorario, diaNome: string, slotFixo: SlotFixo): string {
    const diaEncontrado = espaco.horarios.find(d => d.nome === diaNome);
    if (diaEncontrado) {
      const slotEncontrado = diaEncontrado.slots.find(s => s.hora === slotFixo.descricao);
      return slotEncontrado ? slotEncontrado.status : ' ';
    }
    return ' ';
  }

  toggleModoEdicao(espaco: EspacoHorario): void {
    espaco.isEditing = !espaco.isEditing;
    console.log(`Modo de edição para ${espaco.nomeDisplay}:`, espaco.isEditing);
  }

  atualizarStatusSlot(espaco: EspacoHorario, diaNome: string, slotFixo: SlotFixo): void {
    if (!espaco.isEditing) {
      console.log('Modo de edição não está ativo. Não é possível alterar o status.');
      return;
    }

    let diaParaAtualizar = espaco.horarios.find(d => d.nome === diaNome);

    if (!diaParaAtualizar) {
      diaParaAtualizar = { nome: diaNome, slots: [] };
      espaco.horarios.push(diaParaAtualizar);
    }

    const indiceSlotExistente = diaParaAtualizar.slots.findIndex(s => s.hora === slotFixo.descricao);

    if (indiceSlotExistente !== -1) {
      const statusAtual = diaParaAtualizar.slots[indiceSlotExistente].status;
      if (statusAtual === 'Livre' || statusAtual === 'Disponível') {
        diaParaAtualizar.slots.splice(indiceSlotExistente, 1);
        console.log(`Slot ${slotFixo.descricao} (${diaNome}) para ${espaco.nomeDisplay} agora está VAZIO.`);
      } else {
        diaParaAtualizar.slots[indiceSlotExistente].status = 'Livre';
        console.log(`Slot ${slotFixo.descricao} (${diaNome}) para ${espaco.nomeDisplay} agora está Livre (era ${statusAtual}).`);
      }
    } else {
      diaParaAtualizar.slots.push({ hora: slotFixo.descricao, status: 'Livre' });
      console.log(`Slot ${slotFixo.descricao} (${diaNome}) para ${espaco.nomeDisplay} MARCADO como Livre.`);
    }
  }
}