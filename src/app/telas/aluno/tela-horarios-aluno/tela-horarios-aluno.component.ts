import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component'; // Ajuste o caminho se necessário
// Importar as interfaces e os dados mockados dos horários
import { EspacoHorario, MOCK_ESPACOS_HORARIOS, HorarioSlot, DiaDaSemana } from '../../../core/mocks/mock-horarios'; // Ou mock-carteiras.ts

// Interface para SlotFixo (pode ser movida para um arquivo compartilhado se usada em múltiplos lugares)
interface SlotFixo {
  id: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
  bloco: 'AB' | 'CD' | 'EF';
  descricao: string;
}

@Component({
  selector: 'app-tela-horarios-aluno',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './tela-horarios-aluno.component.html',
  styleUrl: './tela-horarios-aluno.component.css'
})
export class TelaHorariosAlunoComponent implements OnInit {
  listaDeEspacos: EspacoHorario[] = []; // Para o *ngFor que vai listar cada espaço e sua tabela
  diasDaSemanaCabecalho: string[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']; // E Sábado/Domingo se aplicável

  // Definição dos slots de horário fixos (igual ao do funcionário)
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
  // Não precisamos de 'todosOsSlotsFixos' aqui, pois vamos iterar dentro de cada espaço no HTML

  constructor() { }

  ngOnInit(): void {
    // Carrega todos os espaços com seus respectivos horários mockados
    // Não precisamos do isExpanded ou isEditing aqui, pois todas as tabelas serão visíveis (ao rolar)
    this.listaDeEspacos = MOCK_ESPACOS_HORARIOS;
    console.log('Dados de horários para aluno carregados:', this.listaDeEspacos);
  }

  // Método para obter o status de um slot específico para um dia e espaço
  // (idêntico ao do HorariosComponent do funcionário)
  getStatusSlot(espaco: EspacoHorario, diaNome: string, slotFixoDescricao: string): string {
    const diaEncontrado = espaco.horarios.find(d => d.nome === diaNome);
    if (diaEncontrado) {
      const slotEncontrado = diaEncontrado.slots.find(s => s.hora === slotFixoDescricao);
      return slotEncontrado ? slotEncontrado.status : ' '; // Retorna status ou string vazia
    }
    return ' '; // Retorna string vazia se o dia não tem slots definidos
  }
}