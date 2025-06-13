import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';

// Serviços e Entidades Reais
import { Local } from '../../../entity/Local';
import { LocalService } from '../../../services/localService';
import { HorarioService } from '../../../services/horarioService'; // Importa apenas o serviço
import { Disponibilidade } from '../../../entity/Disponibilidade';

// Interfaces para a View
interface SlotFixo {
  id: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
  bloco: 'AB' | 'CD' | 'EF';
  descricao: string;
}

interface EspacoComHorarios extends Local {
  disponibilidades: Disponibilidade[];
  isExpanded?: boolean;
  isEditing?: boolean;
}

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit {
  listaCompletaEspacos: EspacoComHorarios[] = [];
  espacosFiltrados: EspacoComHorarios[] = [];

  diasDaSemanaCabecalho: { nome: string, numero: number }[] = [
    { nome: 'Segunda', numero: 1 }, { nome: 'Terça', numero: 2 },
    { nome: 'Quarta', numero: 3 }, { nome: 'Quinta', numero: 4 }, { nome: 'Sexta', numero: 5 }
  ];

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

  constructor(
    private localService: LocalService,
    private horarioService: HorarioService
  ) { }

  ngOnInit(): void {
    this.todosOsSlotsFixos = this.slotsFixosPorPeriodo.flatMap(periodo => periodo.slots);
    this.carregarDadosDaApi();
  }

  carregarDadosDaApi(): void {
    this.localService.listarLocais().subscribe({
      next: (locais) => {
        if (!locais || locais.length === 0) {
          this.listaCompletaEspacos = [];
          this.filtrarEspacos('');
          return;
        }

        const chamadasParaCadaLocal$ = locais.map(local => {
          const chamadasPorDia$ = this.diasDaSemanaCabecalho.map(dia =>
            this.horarioService.getDisponibilidade(local._id, dia.numero)
          );
          return forkJoin(chamadasPorDia$).pipe(
            map(respostasPorDia => ({
              ...local,
              disponibilidades: respostasPorDia.flat(),
              isExpanded: false,
              isEditing: false
            }))
          );
        });

        forkJoin(chamadasParaCadaLocal$).subscribe({
          next: (espacosCompletos) => {
            this.listaCompletaEspacos = espacosCompletos;
            this.filtrarEspacos('');
          },
          error: (err) => console.error('Erro ao carregar todas as disponibilidades:', err)
        });
      },
      error: (err) => console.error('Erro ao carregar locais:', err)
    });
  }

  getStatusSlot(espaco: EspacoComHorarios, diaNumero: number, slotFixoDescricao: string): { status: string, id?: string } {
    const horaDeInicio = slotFixoDescricao.split(' ')[0];
    const disponibilidade = espaco.disponibilidades?.find(h =>
      h.diaDaSemana === diaNumero && h.horarioInicio === horaDeInicio
    );
    return disponibilidade ? { status: 'Livre', id: disponibilidade._id } : { status: ' ' };
  }

  atualizarStatusSlot(espaco: EspacoComHorarios, diaNumero: number, slotFixo: SlotFixo): void {
    if (!espaco.isEditing) return;

    const disponibilidadeExistente = this.getStatusSlot(espaco, diaNumero, slotFixo.descricao);

    if (disponibilidadeExistente.status === 'Livre' && disponibilidadeExistente.id) {
      this.horarioService.deletarDisponibilidade(disponibilidadeExistente.id).subscribe({
        next: () => this.atualizarEstadoLocal(espaco._id, disponibilidadeExistente.id!, null),
        error: (err) => console.error('Erro ao remover disponibilidade:', err)
      });
    } else {
      const [horaDeInicio, , horaDeFim] = slotFixo.descricao.split(' ');
      this.horarioService.criarDisponibilidade(espaco._id, diaNumero, horaDeInicio, horaDeFim).subscribe({
        next: (novaDisponibilidade) => this.atualizarEstadoLocal(espaco._id, null, novaDisponibilidade),
        error: (err) => console.error('Erro ao criar disponibilidade:', err)
      });
    }
  }

  private atualizarEstadoLocal(espacoId: string, idRemovido: string | null, adicionado: Disponibilidade | null) {
    const espacoIndex = this.listaCompletaEspacos.findIndex(e => e._id === espacoId);
    if (espacoIndex === -1) return;

    const espacoOriginal = this.listaCompletaEspacos[espacoIndex];
    let novasDisponibilidades: Disponibilidade[];

    if (idRemovido) {
      novasDisponibilidades = espacoOriginal.disponibilidades.filter(h => h._id !== idRemovido);
    } else if (adicionado) {
      novasDisponibilidades = [...espacoOriginal.disponibilidades, adicionado];
    } else {
      return;
    }
    
    const espacoAtualizado = { ...espacoOriginal, disponibilidades: novasDisponibilidades };
    
    const novaListaCompleta = [...this.listaCompletaEspacos];
    novaListaCompleta[espacoIndex] = espacoAtualizado;
    
    this.listaCompletaEspacos = novaListaCompleta;

    this.filtrarEspacos(document.querySelector<HTMLInputElement>('.search-bar input')?.value || '');
  }

  toggleDetalhesEspaco(espaco: EspacoComHorarios): void {
    espaco.isExpanded = !espaco.isExpanded;
    if (!espaco.isExpanded) espaco.isEditing = false;
  }

  filtrarEspacos(termoBuscaInput: string): void {
    const termo = termoBuscaInput.trim().toLowerCase();
    if (!termo) {
      this.espacosFiltrados = [...this.listaCompletaEspacos];
    } else {
      this.espacosFiltrados = this.listaCompletaEspacos.filter(espaco =>
        espaco.nome.toLowerCase().includes(termo)
      );
    }
  }

  toggleModoEdicao(espaco: EspacoComHorarios): void {
    espaco.isEditing = !espaco.isEditing;
  }
}