import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, map } from 'rxjs';

// Serviços e Entidades Reais
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { Carteirinha } from '../../../entity/Carteirinha';
import { Local } from '../../../entity/Local';
import { Disponibilidade } from '../../../entity/Disponibilidade';
import { LocalService } from '../../../services/localService';
import { HorarioService } from '../../../services/horarioService';

// Interface para a View do Resumo de Horários
interface EspacoResumo extends Local {
  disponibilidades?: Disponibilidade[]; // Será preenchido sob demanda
  estaCarregando?: boolean;           // Para mostrar um feedback de loading
  isExpanded?: boolean;               // Para o estado do acordeão
}

// Interface para o SlotFixo (usada para renderizar a tabela)
interface SlotFixo {
  id: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
  bloco: 'AB' | 'CD' | 'EF';
  descricao: string;
}

@Component({
  selector: 'app-visao-geral-funcionario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './visao-geral-funcionario.component.html',
  styleUrl: './visao-geral-funcionario.component.css'
})
export class VisaoGeralFuncionarioComponent implements OnInit {
  primeirasCarteirasPendentes: Carteirinha[] = [];
  temCarteirasPendentes: boolean = false;
  
  algunsEspacosResumo: EspacoResumo[] = []; // Usa a nova interface
  temHorariosResumo: boolean = false;

  diasDaSemanaCabecalho: { nome: string, numero: number }[] = [
    { nome: 'Segunda', numero: 1 },
    { nome: 'Terça', numero: 2 },
    { nome: 'Quarta', numero: 3 },
    { nome: 'Quinta', numero: 4 },
    { nome: 'Sexta', numero: 5 }
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

  constructor(
    private carteirinhaService: CarteirinhaService,
    private localService: LocalService,
    private horarioService: HorarioService
  ) { }

  ngOnInit(): void {
    // Carrega o resumo de carteirinhas pendentes
    this.carteirinhaService.getCarteirinhasPendentes().subscribe(carteirinhas => {
      this.primeirasCarteirasPendentes = carteirinhas.slice(0, 3);
      this.temCarteirasPendentes = this.primeirasCarteirasPendentes.length > 0;
    });

    // Carrega o resumo de espaços (apenas os nomes inicialmente)
    this.localService.listarLocais().subscribe(locais => {
      this.algunsEspacosResumo = locais.slice(0, 3).map(local => ({
        ...local,
        isExpanded: false
      }));
      this.temHorariosResumo = this.algunsEspacosResumo.length > 0;
    });
  }

  toggleHorarioResumo(espaco: EspacoResumo): void {
    espaco.isExpanded = !espaco.isExpanded;

    if (espaco.isExpanded && !espaco.disponibilidades) {
      espaco.estaCarregando = true;
      
      const chamadasPorDia$ = this.diasDaSemanaCabecalho.map(dia =>
        this.horarioService.getDisponibilidade(espaco._id, dia.numero)
      );

      forkJoin(chamadasPorDia$).subscribe({
        next: (respostasPorDia) => {
          espaco.disponibilidades = respostasPorDia.flat();
          espaco.estaCarregando = false; 
          console.log(`Horários carregados para ${espaco.nome}:`, espaco.disponibilidades);
        },
        error: (err) => {
          console.error(`Erro ao carregar horários para ${espaco.nome}:`, err);
          espaco.estaCarregando = false;
        }
      });
    }
  }

  // Método auxiliar para a tabela, igual ao de HorariosComponent
  getStatusSlot(espaco: EspacoResumo, diaNumero: number, slotFixoDescricao: string): { status: string, id?: string } {
    if (!espaco.disponibilidades) {
      return { status: ' ' }; 
    }
    const horaDeInicio = slotFixoDescricao.split(' ')[0];
    const disponibilidade = espaco.disponibilidades.find(h =>
      h.diaDaSemana === diaNumero && h.horarioInicio === horaDeInicio
    );
    return disponibilidade ? { status: 'Livre', id: disponibilidade._id } : { status: ' ' };
  }
}