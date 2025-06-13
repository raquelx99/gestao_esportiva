import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, map, Observable } from 'rxjs'; // Importar forkJoin e map

// Serviços e Entidades Reais
import { Local } from '../../../entity/Local';
import { LocalService } from '../../../services/localService';
import { HorarioService } from '../../../services/horarioService';
import { Disponibilidade } from '../../../entity/Disponibilidade';

// Interfaces para a View (podem continuar as mesmas)
interface SlotFixo {
  id: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
  bloco: 'AB' | 'CD' | 'EF';
  descricao: string;
}

// Interface para o objeto que o template vai usar
// Ele combina os dados do Local com a lista de Disponibilidades
interface EspacoComHorarios extends Local {
  disponibilidades: Disponibilidade[]; // Armazena as disponibilidades da API
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
  listaCompletaEspacos: EspacoComHorarios[] = []; // Usa o novo tipo
  espacosFiltrados: EspacoComHorarios[] = [];

  diasDaSemanaCabecalho: { nome: string, numero: number }[] = [
    { nome: 'Segunda', numero: 1 },
    { nome: 'Terça', numero: 2 },
    { nome: 'Quarta', numero: 3 },
    { nome: 'Quinta', numero: 4 },
    { nome: 'Sexta', numero: 5 }
  ];

  slotsFixosPorPeriodo: { periodo: string, slots: SlotFixo[] }[] = [
    // ... (sua definição de slotsFixosPorPeriodo como antes) ...
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

  // Injetar os serviços no construtor
  constructor(
    private localService: LocalService,
    private horarioService: HorarioService
  ) { }

  ngOnInit(): void {
    this.todosOsSlotsFixos = this.slotsFixosPorPeriodo.flatMap(periodo => periodo.slots);
    this.carregarDadosDaApi(); // Chama o novo método para carregar dados reais
  }

  carregarDadosDaApi(): void {
    // 1. Busca a lista de todos os locais (espaços)
    this.localService.listarLocais().subscribe({
      next: (locais) => {
        if (!locais || locais.length === 0) {
          this.listaCompletaEspacos = [];
          this.filtrarEspacos('');
          return;
        }

        // 2. Para cada local, cria um array de chamadas para buscar suas disponibilidades de toda a semana
        const chamadasParaCadaLocal$ = locais.map(local => {
          const chamadasPorDia$ = this.diasDaSemanaCabecalho.map(dia =>
            this.horarioService.getDisponibilidade(local._id, dia.numero)
          );
          // forkJoin espera todas as chamadas de um local terminarem (segunda a sexta)
          return forkJoin(chamadasPorDia$).pipe(
            map(respostasPorDia => {
              // Junta os arrays de disponibilidades de todos os dias em um só
              const todasDisponibilidades = respostasPorDia.flat();
              // Cria o objeto que o template usará
              return {
                ...local,
                disponibilidades: todasDisponibilidades,
                isExpanded: false,
                isEditing: false
              };
            })
          );
        });

        // 3. forkJoin espera todos os locais terem seus horários carregados
        forkJoin(chamadasParaCadaLocal$).subscribe({
          next: (espacosCompletos) => {
            this.listaCompletaEspacos = espacosCompletos;
            this.filtrarEspacos(''); // Popula a lista para exibição
            console.log('Dados completos carregados da API:', this.listaCompletaEspacos);
          },
          error: (err) => console.error('Erro ao carregar todas as disponibilidades:', err)
        });
      },
      error: (err) => console.error('Erro ao carregar locais:', err)
    });
  }

  // Método getStatusSlot agora busca a disponibilidade na lista que veio da API
  getStatusSlot(espaco: EspacoComHorarios, diaNumero: number, slotFixoDescricao: string): { status: string, id?: string } {
    const horaDeInicio = slotFixoDescricao.split(' ')[0];
    const disponibilidade = espaco.disponibilidades.find(h =>
      h.diaDaSemana === diaNumero && h.horarioInicio === horaDeInicio
    );
    // Retorna um objeto com o status e o ID da disponibilidade (para o DELETE)
    return disponibilidade ? { status: 'Livre', id: disponibilidade._id } : { status: ' ' };
  }

  // Método para atualizar o status, agora chamando a API
  atualizarStatusSlot(espaco: EspacoComHorarios, diaNumero: number, slotFixo: SlotFixo): void {
  if (!espaco.isEditing) {
    return; // Sai da função se não estiver em modo de edição
  }

  const disponibilidadeExistente = this.getStatusSlot(espaco, diaNumero, slotFixo.descricao);

  if (disponibilidadeExistente.status === 'Livre' && disponibilidadeExistente.id) {
    // --- LÓGICA PARA DELETAR ---
    this.horarioService.deletarDisponibilidade(disponibilidadeExistente.id).subscribe({
        next: () => {
          console.log('Disponibilidade removida com sucesso no back-end!');
          
          // ATUALIZA O ESTADO LOCAL DE FORMA IMUTÁVEL PARA FORÇAR A DETECÇÃO
          const espacoIndex = this.listaCompletaEspacos.findIndex(e => e._id === espaco._id);
          if (espacoIndex > -1) {
            const novasDisponibilidades = espaco.disponibilidades.filter(h => h._id !== disponibilidadeExistente.id);
            const espacoAtualizado = { ...espaco, disponibilidades: novasDisponibilidades };
            
            const novaListaCompleta = [...this.listaCompletaEspacos];
            novaListaCompleta[espacoIndex] = espacoAtualizado;
            this.listaCompletaEspacos = novaListaCompleta;

            // Re-aplica o filtro para atualizar a view
            this.filtrarEspacos(document.querySelector<HTMLInputElement>('.search-bar input')?.value || '');
          }
        },
        error: (err) => console.error('Erro ao remover disponibilidade:', err)
      });
    } else {
      // --- LÓGICA PARA CRIAR ---
      const horaDeInicio = slotFixo.descricao.split(' ')[0];
      const horaDeFim = slotFixo.descricao.split(' ')[2];

      this.horarioService.criarDisponibilidade(espaco._id, diaNumero, horaDeInicio, horaDeFim).subscribe({
        next: (novaDisponibilidade) => {
          console.log('Disponibilidade criada com sucesso no back-end!', novaDisponibilidade);

          // ATUALIZA O ESTADO LOCAL DE FORMA IMUTÁVEL
          const espacoIndex = this.listaCompletaEspacos.findIndex(e => e._id === espaco._id);
          if (espacoIndex > -1) {
            const novasDisponibilidades = [...espaco.disponibilidades, novaDisponibilidade];
            const espacoAtualizado = { ...espaco, disponibilidades: novasDisponibilidades };
            
            const novaListaCompleta = [...this.listaCompletaEspacos];
            novaListaCompleta[espacoIndex] = espacoAtualizado;
            this.listaCompletaEspacos = novaListaCompleta;

            // Re-aplica o filtro para atualizar a view
            this.filtrarEspacos(document.querySelector<HTMLInputElement>('.search-bar input')?.value || '');
          }
        },
        error: (err) => console.error('Erro ao criar disponibilidade:', err)
      });
    }
  }

  // Seus outros métodos (toggleDetalhesEspaco, filtrarEspacos, toggleModoEdicao)
  // continuam os mesmos, mas os tipos de parâmetro devem ser EspacoComHorarios
  toggleDetalhesEspaco(espaco: EspacoComHorarios): void {
    espaco.isExpanded = !espaco.isExpanded;
      if (!espaco.isExpanded) espaco.isEditing = false;
    }

    filtrarEspacos(termoBuscaInput: string): void {
    // 1. Normaliza o termo de busca: remove espaços em branco do início/fim e converte para minúsculas.
    const termo = termoBuscaInput.trim().toLowerCase();

    // 2. Se o termo de busca estiver vazio, mostra todos os espaços.
    if (!termo) {
      // A lista filtrada recebe uma cópia completa de todos os espaços.
      this.espacosFiltrados = [...this.listaCompletaEspacos];
      return; // Encerra a função aqui.
    }

    // 3. Se houver um termo, filtra a lista completa.
    this.espacosFiltrados = this.listaCompletaEspacos.filter(espaco =>
      
      espaco.nome.toLowerCase().includes(termo)
    );

    console.log('Termo buscado (horários):', termo, 'Resultados na lista filtrada:', this.espacosFiltrados.length);
  }

  toggleModoEdicao(espaco: EspacoComHorarios): void {
    espaco.isEditing = !espaco.isEditing;
  }

}