import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component';
import { AuthService } from '../../../services/auth.service';
import { LocalService } from '../../../services/localService';
import { HorarioService, Disponibilidade } from '../../../services/horarioService';

interface SlotFixo {
  id: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
  bloco: 'AB' | 'CD' | 'EF';
  descricao: string;
}

interface SlotStatus {
  hora: string;
  status: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
}

interface HorarioDia {
  nome: string;     
  slots: SlotStatus[];
}

interface EspacoHorario {
  id: string;
  nome: string;
  horarios: HorarioDia[];
}

@Component({
  selector: 'app-tela-horarios-aluno',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './tela-horarios-aluno.component.html',
  styleUrls: ['./tela-horarios-aluno.component.css']
})
export class TelaHorariosAlunoComponent implements OnInit {
  listaDeEspacos: EspacoHorario[] = [];

  // Cabeçalho de dias da semana (apenas para exibição na tabela)
  diasDaSemanaCabecalho: string[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  // Slots fixos por período, conforme imagem de turnos/blocos
  slotsFixosPorPeriodo: SlotFixo[] = [
    // Manhã
    { id: 'M_AB', periodo: 'Manhã', bloco: 'AB', descricao: '07:30 - 09:10' },
    { id: 'M_CD', periodo: 'Manhã', bloco: 'CD', descricao: '09:30 - 11:10' },
    { id: 'M_EF', periodo: 'Manhã', bloco: 'EF', descricao: '11:20 - 13:00' },
    // Tarde
    { id: 'T_AB', periodo: 'Tarde', bloco: 'AB', descricao: '13:30 - 15:10' },
    { id: 'T_CD', periodo: 'Tarde', bloco: 'CD', descricao: '15:20 - 17:10' },
    { id: 'T_EF', periodo: 'Tarde', bloco: 'EF', descricao: '17:10 - 19:00' },
    // Noite
    { id: 'N_AB', periodo: 'Noite', bloco: 'AB', descricao: '19:00 - 20:40' },
    { id: 'N_CD', periodo: 'Noite', bloco: 'CD', descricao: '21:00 - 22:40' }
  ];

  constructor(
    private authService: AuthService,
    private localService: LocalService,
    private horarioService: HorarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1) Verifica usuário logado
    const usuarioLogado = this.authService.usuarioLogado;
    if (!usuarioLogado || usuarioLogado.usuario.role !== 'estudante') {
      this.router.navigate(['/boas-vindas']);
      return;
    }
    // 2) Obtém lista de espaços da carteirinha (nomes)
    const espacosCarteirinha: string[] = this.authService.usuarioLogado.carteirinha?.espacos || [];
    if (espacosCarteirinha.length === 0) {
      this.listaDeEspacos = [];
      return;
    }
    // 3) Determina dia da semana atual
    const hoje = new Date();
    const diaSemanaNum = hoje.getDay(); // 0=domingo,1=segunda,...6=sábado
    // Você pode optar por exibir apenas de segunda(1) a sexta(5). Aqui vamos usar getDay() diretamente.
    const nomeDiaAtual = this.obterNomeDoDia(hoje); // ex 'segunda-feira'

    // 4) Lista todos os locais do backend
    this.localService.listarLocais().subscribe({
      next: (todosLocais) => {
        // Filtra apenas os que o aluno possui
        const locaisFiltrados = todosLocais.filter(loc =>
          espacosCarteirinha.includes(loc.nome)
        );
        if (locaisFiltrados.length === 0) {
          this.listaDeEspacos = [];
          return;
        }
        // 5) Para cada local filtrado, chama disponibilidade para o dia
        const chamadas: Observable<Disponibilidade[]>[] = locaisFiltrados.map(loc =>
          this.horarioService.getDisponibilidade(loc._id, diaSemanaNum)
        );
        forkJoin(chamadas).subscribe({
          next: listasDeDisponibilidadesPorLocal => {
            // Monta o array final
            const resultado: EspacoHorario[] = locaisFiltrados.map((loc, idx) => {
              const disponArray = listasDeDisponibilidadesPorLocal[idx];
              // Monta HorarioDia para este espaço
              const horarioDia: HorarioDia = {
                nome: nomeDiaAtual,
                slots: []
              };
              // Para cada slot fixo, determina status
              for (const slotFixo of this.slotsFixosPorPeriodo) {
                // Extrai início: '07:30' de '07:30 - 09:10'
                const partes = slotFixo.descricao.split('-')[0].trim();
                const horarioInicioFixo = partes; // ex '07:30'
                // Procura na disponibilidade do backend
                const entry = disponArray.find(d => {
                  const hi: string = d.horarioInicio;
                  // compara com ou sem zero à esquerda
                  return hi === horarioInicioFixo || hi === removeZeroEsquerda(horarioInicioFixo);
                });
                let status: string;
                if (entry) {
                  status = entry.estaDisponivel ? 'Livre' : 'Ocupado';
                } else {
                  // sem registro: interpretamos como “Indisponível” ou espaço não abre naquele horário
                  status = 'Indisponível';
                }
                horarioDia.slots.push({
                  hora: slotFixo.descricao,
                  status,
                  periodo: slotFixo.periodo
                });
              }
              return {
                id: loc._id,
                nome: loc.nome,
                horarios: [horarioDia]
              };
            });
            this.listaDeEspacos = resultado;
          },
          error: err => {
            console.error('Erro ao buscar disponibilidades:', err);
            this.listaDeEspacos = [];
          }
        });
      },
      error: err => {
        console.error('Erro ao listar locais:', err);
        this.listaDeEspacos = [];
      }
    });
  }

  // Retorna o nome do dia em português
  private obterNomeDoDia(date: Date): string {
    switch (date.getDay()) {
      case 1: return 'segunda-feira';
      case 2: return 'terça-feira';
      case 3: return 'quarta-feira';
      case 4: return 'quinta-feira';
      case 5: return 'sexta-feira';
      case 6: return 'sábado';
      case 0: return 'domingo';
      default: return '';
    }
  }

  // Método chamado no template para obter o caminho da imagem do espaço
  getImagemEspaco(espacoId: string): string {
    // Ajuste o caminho base conforme sua pasta de assets
    const basePath = '/assets/images/'; // por exemplo
    let imageName = 'default-espaco.png';
    // Você pode mapear pelo nome ou id. Aqui mapeamos pelo id ou nome:
    // Se quiser usar o nome, receba espacoNome em vez de id
    switch (espacoId.toLowerCase()) {
      case 'piscina':
      case 'id-da-piscina-se-for-por-id': 
        imageName = 'Piscina.png';
        break;
      case 'quadra':
      case 'quadra-poliesportiva':
      case 'id-da-quadra': 
        imageName = 'Quadra.png';
        break;
      case 'campo society':
      case 'campo-society':
      case 'id-do-campo': 
        imageName = 'Society.png';
        break;
      case 'quadra de tênis':
      case 'quadra-tenis':
      case 'id-do-tenis':
        imageName = 'Tenis.png';
        break;
      case 'quadra de areia':
      case 'quadra-areia':
      case 'id-da-areia':
        imageName = 'Areia.png';
        break;
      case 'pista de atletismo':
      case 'pista-atletismo':
      case 'id-da-atletismo':
        imageName = 'Atletismo.png';
        break;
      default:
        imageName = 'default-espaco.png';
    }
    return basePath + imageName;
  }

  // Método chamado no template para obter status de um slot em determinado dia
  // Porém, aqui no design que fizemos, o status já foi calculado e está em listaDeEspacos[].horarios[0].slots
  // Se, ainda assim, quiser um método auxiliar, pode ser:
  getStatusSlot(espaco: EspacoHorario, diaNome: string, slotDescricao: string): string {
    // Localiza HorarioDia no espaco.horarios
    const hd = espaco.horarios.find(h => h.nome === diaNome.toLowerCase() || h.nome.toLowerCase() === diaNome.toLowerCase());
    if (!hd) return ' ';
    const slot = hd.slots.find(s => s.hora === slotDescricao);
    return slot ? slot.status : ' ';
  }
}

// Helper para comparar sem zero à esquerda
function removeZeroEsquerda(hora: string): string {
  const [h, m] = hora.split(':');
  if (h && h.startsWith('0')) {
    return `${parseInt(h, 10)}:${m}`;
  }
  return hora;
}