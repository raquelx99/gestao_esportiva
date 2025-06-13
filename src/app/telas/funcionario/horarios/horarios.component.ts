import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, map, of } from 'rxjs';


// Serviços e Entidades Reais
import { Local } from '../../../entity/Local';
import { LocalService } from '../../../services/localService';
import { HorarioService } from '../../../services/horarioService'; // Importa apenas o serviço
import { Disponibilidade } from '../../../entity/Disponibilidade';

interface SlotFixo { id: string; periodo: 'Manhã' | 'Tarde' | 'Noite'; bloco: 'AB' | 'CD' | 'EF'; descricao: string; }
interface EspacoComHorarios extends Local {
  disponibilidades: Disponibilidade[];
  disponibilidadesBackup?: Disponibilidade[];
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
  private termoBuscaAtual: string = '';
  diasDaSemanaCabecalho: { nome: string, numero: number }[] = [ { nome: 'Segunda', numero: 1 }, { nome: 'Terça', numero: 2 }, { nome: 'Quarta', numero: 3 }, { nome: 'Quinta', numero: 4 }, { nome: 'Sexta', numero: 5 } ];
  slotsFixosPorPeriodo: { periodo: string, slots: SlotFixo[] }[] = [ { periodo: 'Manhã', slots: [ { id: 'M_AB', periodo: 'Manhã', bloco: 'AB', descricao: '07:30 - 09:10' }, { id: 'M_CD', periodo: 'Manhã', bloco: 'CD', descricao: '09:30 - 11:10' }, { id: 'M_EF', periodo: 'Manhã', bloco: 'EF', descricao: '11:20 - 13:00' } ]}, { periodo: 'Tarde', slots: [ { id: 'T_AB', periodo: 'Tarde', bloco: 'AB', descricao: '13:30 - 15:10' }, { id: 'T_CD', periodo: 'Tarde', bloco: 'CD', descricao: '15:20 - 17:10' }, { id: 'T_EF', periodo: 'Tarde', bloco: 'EF', descricao: '17:10 - 19:00' } ]}, { periodo: 'Noite', slots: [ { id: 'N_AB', periodo: 'Noite', bloco: 'AB', descricao: '19:00 - 20:40' }, { id: 'N_CD', periodo: 'Noite', bloco: 'CD', descricao: '21:00 - 22:40' } ]} ];

  constructor(
    private localService: LocalService,
    private horarioService: HorarioService,
  ) { }

  ngOnInit(): void {
    this.carregarDadosDaApi();
  }

  carregarDadosDaApi(): void {
    this.localService.listarLocais().subscribe({
      next: (locais) => {
        if (!locais || locais.length === 0) { this.listaCompletaEspacos = []; this.filtrarEspacos(); return; }
        const chamadasParaCadaLocal$ = locais.map(local => {
          const chamadasPorDia$ = this.diasDaSemanaCabecalho.map(dia => this.horarioService.getDisponibilidade(local._id, dia.numero));
          return forkJoin(chamadasPorDia$).pipe( map(respostasPorDia => ({ ...local, disponibilidades: respostasPorDia.flat(), isExpanded: false, isEditing: false })) );
        });
        forkJoin(chamadasParaCadaLocal$).subscribe({
          next: (espacosCompletos) => {
            this.listaCompletaEspacos = espacosCompletos;
            this.filtrarEspacos('');
            // ADICIONE ESTE LOG DETALHADO:
            console.log('DADOS FINAIS CARREGADOS DA API:');
            espacosCompletos.forEach(espaco => {
              console.log(`--- Espaço: ${espaco.nome} ---`);
              console.log('Disponibilidades recebidas:', espaco.disponibilidades);
            });
          },
          error: (err) => console.error('Erro ao carregar todas as disponibilidades:', err)
        });
      },
      error: (err) => console.error('Erro ao carregar locais:', err)
    });
  }

  getStatusSlot(espaco: EspacoComHorarios, diaNumero: number, slotFixoDescricao: string): { status: string, id?: string } {
    const horaDeInicio = slotFixoDescricao.split(' ')[0];
    const disponibilidade = espaco.disponibilidades?.find(h => Number(h.diaDaSemana) === diaNumero && h.horarioInicio === horaDeInicio);
    return disponibilidade ? { status: 'Livre', id: disponibilidade._id } : { status: ' ' };
  }

  entrarModoEdicao(espaco: EspacoComHorarios): void {
    espaco.disponibilidadesBackup = JSON.parse(JSON.stringify(espaco.disponibilidades));
    espaco.isEditing = true;
  }

  atualizarStatusSlotLocalmente(espaco: EspacoComHorarios, diaNumero: number, slotFixo: SlotFixo): void {
    if (!espaco.isEditing) return;
    const disponibilidadeExistente = this.getStatusSlot(espaco, diaNumero, slotFixo.descricao);
    const horaDeInicio = slotFixo.descricao.split(' ')[0];
    if (disponibilidadeExistente.id) {
      espaco.disponibilidades = espaco.disponibilidades.filter(h => !(Number(h.diaDaSemana) === diaNumero && h.horarioInicio === horaDeInicio));
    } else {
      const [_, , horaDeFim] = slotFixo.descricao.split(' ');
      espaco.disponibilidades.push({ _id: `temp_${Date.now()}`, local: espaco, diaDaSemana: diaNumero, horarioInicio: horaDeInicio, horarioFinal: horaDeFim, estaDisponivel: true });
    }
  }

  concluirEdicao(espaco: EspacoComHorarios): void {
    if (!espaco.isEditing || !espaco.disponibilidadesBackup) return;
    const estadoOriginal = espaco.disponibilidadesBackup;
    const estadoAtual = espaco.disponibilidades;

    const paraCriar = estadoAtual.filter(atual => !estadoOriginal.find(o => o.horarioInicio === atual.horarioInicio && Number(o.diaDaSemana) === atual.diaDaSemana));
    const paraDeletar = estadoOriginal.filter(original => !estadoAtual.find(a => a.horarioInicio === original.horarioInicio && Number(a.diaDaSemana) === original.diaDaSemana));
    
    const chamadasCriar$ = paraCriar.map(c => this.horarioService.criarDisponibilidade(espaco._id, c.diaDaSemana, c.horarioInicio, c.horarioFinal));
    const chamadasDeletar$ = paraDeletar.map(d => this.horarioService.deletarDisponibilidade(d._id));
    const todasAsChamadas = [...chamadasCriar$, ...chamadasDeletar$];

    if (todasAsChamadas.length === 0) {
      console.log('Nenhuma mudança para salvar.');
      espaco.isEditing = false;
      delete espaco.disponibilidadesBackup;
      return;
    }

    forkJoin(todasAsChamadas.length > 0 ? todasAsChamadas : [of(null)]).subscribe({
      next: () => {
        console.log('Alterações salvas com sucesso no back-end!');
        espaco.isEditing = false;
        delete espaco.disponibilidadesBackup;
        // Opcional: Recarregar os dados para ter 100% de certeza do estado pós-salvamento
        // this.carregarDadosDaApi();
      },
      error: (err) => console.error('Ocorreu um erro ao salvar as alterações:', err)
    });
  }
  
  toggleDetalhesEspaco(espaco: EspacoComHorarios): void {
    espaco.isExpanded = !espaco.isExpanded;
    if (!espaco.isExpanded && espaco.isEditing) {
      // Se fechar o acordeão durante a edição, descarta as mudanças
      espaco.disponibilidades = espaco.disponibilidadesBackup || [];
      espaco.isEditing = false;
      delete espaco.disponibilidadesBackup;
    }
  }

  filtrarEspacos(termoBusca?: string): void {
    if (typeof termoBusca === 'string') { this.termoBuscaAtual = termoBusca.trim().toLowerCase(); }
    let listaFiltrada = [...this.listaCompletaEspacos];
    if (this.termoBuscaAtual) {
      listaFiltrada = this.listaCompletaEspacos.filter(espaco => espaco.nome.toLowerCase().includes(this.termoBuscaAtual));
    }
    this.espacosFiltrados = listaFiltrada;
  }

  trackByEspacoId(index: number, espaco: EspacoComHorarios): string { return espaco._id; }
}