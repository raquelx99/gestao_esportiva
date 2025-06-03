import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component';
import { EspacoHorario, MOCK_ESPACOS_HORARIOS,} from '../../../core/mocks/mock-horarios'; // Ou mock-carteiras.ts
import { RouterLink } from '@angular/router';

interface SlotFixo { /* ... (definição de SlotFixo como antes) ... */
  id: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
  bloco: 'AB' | 'CD' | 'EF';
  descricao: string;
}

@Component({
  selector: 'app-tela-horarios-aluno',
  standalone: true,
  imports: [CommonModule, TopBarComponent, RouterLink],
  templateUrl: './tela-horarios-aluno.component.html',
  styleUrl: './tela-horarios-aluno.component.css'
})
export class TelaHorariosAlunoComponent implements OnInit {
  listaDeEspacos: EspacoHorario[] = [];
  diasDaSemanaCabecalho: string[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  slotsFixosPorPeriodo: { periodo: string, slots: SlotFixo[] }[] = [
    // ... (definição de slotsFixosPorPeriodo como antes) ...
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

  constructor() { }

  ngOnInit(): void {
    this.listaDeEspacos = MOCK_ESPACOS_HORARIOS;
    console.log('Dados de horários para aluno carregados:', this.listaDeEspacos);
  }

  getStatusSlot(espaco: EspacoHorario, diaNome: string, slotFixoDescricao: string): string {
    // ... (seu método getStatusSlot como antes) ...
    const diaEncontrado = espaco.horarios.find(d => d.nome === diaNome);
    if (diaEncontrado) {
      const slotEncontrado = diaEncontrado.slots.find(s => s.hora === slotFixoDescricao);
      return slotEncontrado ? slotEncontrado.status : ' ';
    }
    return ' ';
  }

  // PASSO 2.1: Novo método para retornar o caminho da imagem
  getImagemEspaco(espacoId: string): string {
  const basePath = '/';
  let imageName = 'default-espaco.png';
  switch (espacoId.toLowerCase()) {
    case 'piscina':
      imageName = 'Piscina.png';
      break;
    case 'quadra-poliesportiva':
      imageName = 'Quadra.png';
      break;
    case 'campo-society':
      imageName = 'Society.png';
      break;
    case 'quadra-tenis':
      imageName = 'Tenis.png';
      break;
    case 'quadra-areia':
      imageName = 'Areia.png';
      break;
    case 'pista-atletismo':
      imageName = 'Atletismo.png';
      break;
  }
  return basePath + imageName;
}
}