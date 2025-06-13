import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, map } from 'rxjs';

import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component';
import { AuthService } from '../../../services/auth.service';
import { LocalService } from '../../../services/localService';
import { HorarioService } from '../../../services/horarioService'; // Importa apenas o serviço
import { Disponibilidade } from '../../../entity/Disponibilidade';
import { Local } from '../../../entity/Local';

interface SlotFixo { id: string; periodo: 'Manhã' | 'Tarde' | 'Noite'; bloco: 'AB' | 'CD' | 'EF'; descricao: string; }
interface EspacoComHorarios extends Local { disponibilidades: Disponibilidade[]; }

@Component({
  selector: 'app-tela-horarios-aluno',
  standalone: true,
  imports: [CommonModule, RouterLink, TopBarComponent],
  templateUrl: './tela-horarios-aluno.component.html',
  styleUrls: ['./tela-horarios-aluno.component.css']
})
export class TelaHorariosAlunoComponent implements OnInit {
  listaDeEspacos: EspacoComHorarios[] = [];
  carregando: boolean = true;

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

  constructor(
    private authService: AuthService,
    private localService: LocalService,
    private horarioService: HorarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioLogado = this.authService.usuarioLogado;
    if (!usuarioLogado || usuarioLogado.usuario.role !== 'estudante') {
      this.router.navigate(['/boas-vindas']);
      return;
    }
    this.carregarDadosDaApi();
  }

  carregarDadosDaApi(): void {
    this.carregando = true;
    this.localService.listarLocais().subscribe({
      next: (todosLocais) => {
        // REMOVIDO: A filtragem pelos espaços da carteirinha. Agora mostra todos os locais.
        if (!todosLocais || todosLocais.length === 0) {
          this.listaDeEspacos = [];
          this.carregando = false;
          return;
        }

        const chamadasParaCadaLocal$ = todosLocais.map(local => {
          const chamadasPorDia$ = this.diasDaSemanaCabecalho.map(dia =>
            this.horarioService.getDisponibilidade(local._id, dia.numero)
          );
          return forkJoin(chamadasPorDia$).pipe(
            map(respostasPorDia => ({ ...local, disponibilidades: respostasPorDia.flat() }))
          );
        });

        forkJoin(chamadasParaCadaLocal$).subscribe({
          next: (espacosCompletos) => {
            this.listaDeEspacos = espacosCompletos;
            this.carregando = false;
          },
          error: (err) => { this.carregando = false; console.error('Erro ao carregar disponibilidades:', err); }
        });
      },
      error: (err) => { this.carregando = false; console.error('Erro ao carregar locais:', err); }
    });
  }

  getImagemEspaco(espacoNome: string): string {
    const basePath = '/';
    let imageName = 'default-espaco.png';
    switch (espacoNome.toLowerCase()) {
      case 'piscina':
        imageName = 'Piscina.png';
        break;
      case 'quadra':
        imageName = 'Quadra.png';
        break;
      case 'campo society':
        imageName = 'Society.png';
        break;
      case 'quadra de tênis':
        imageName = 'Tenis.png';
        break;
      case 'quadra de areia':
        imageName = 'Areia.png';
        break;
      case 'pista de atletismo':
        imageName = 'Atletismo.png';
        break;
    }
    return basePath + imageName;
  }

  getStatusSlot(espaco: EspacoComHorarios, diaNumero: number, slotFixoDescricao: string): string {
    const horaDeInicio = slotFixoDescricao.split(' ')[0];
    const disponibilidade = espaco.disponibilidades?.find(h =>
      Number(h.diaDaSemana) === diaNumero && h.horarioInicio === horaDeInicio
    );
    if (disponibilidade) {
      return disponibilidade.estaDisponivel ? 'Livre' : 'Ocupado';
    }
    return ' ';
  }
}