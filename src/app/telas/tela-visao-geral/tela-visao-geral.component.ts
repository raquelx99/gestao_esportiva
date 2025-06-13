import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TopBarComponent } from '../../componentes/top-bar/top-bar.component';
import { AuthService } from '../../services/auth.service';
import { HorarioService } from '../../services/horarioService';
import { CarteirinhaService } from '../../services/carteirinha.service';
import { LocalService } from '../../services/localService';

import { Estudante } from '../../entity/Estudante';
import { Carteirinha } from '../../entity/Carteirinha';
import { Local } from '../../entity/Local';
import { Disponibilidade } from '../../entity/Disponibilidade';

// INTERFACE ATUALIZADA
interface HorarioAgrupado {
  intervalo: string; // Ex: "17:10 - 19:00"
  espacos: string[];
}

@Component({
  selector: 'app-tela-visao-geral',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './tela-visao-geral.component.html',
  styleUrls: ['./tela-visao-geral.component.css']
})
export class TelaVisaoGeralComponent implements OnInit {
  // Suas outras propriedades (usuarioNome, matricula, etc.) permanecem as mesmas
  usuarioNome!: string;
  matricula!: string;
  curso!: string;
  centro!: string;
  telefone!: string;
  telefoneUrgencia!: string;
  espacosCarteirinha: string[] = [];
  semestreInicioFormatted!: string;
  validadeFormatted!: string;
  isExpired: boolean = false; // Adicionei para a lógica de expiração do HTML

  // Propriedades para horários livres
  nomeDoDiaAtual!: string;
  horariosAgrupados: HorarioAgrupado[] = [];

  constructor(
    private authService: AuthService,
    private carteirinhaService: CarteirinhaService,
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

    // A lógica de busca de carteirinha permanece a mesma
    const estudanteId = usuarioLogado.carteirinha.estudante._id;
    this.carteirinhaService.getCarteirinhaPorEstudante(estudanteId).subscribe({
      next: (carteirinha: Carteirinha) => {
        if (!carteirinha) { this.router.navigate(['/cadastro']); return; }
        if (carteirinha.status === 'pendente') { this.router.navigate(['/espera-validacao']); return; }
        this.preencherTelaComCarteirinha(carteirinha);
      },
      error: (err: any) => {
        console.error('Erro ao buscar carteirinha:', err);
        this.router.navigate(['/cadastro']);
      }
    });
  }

  private preencherTelaComCarteirinha(carteirinha: any) {
    // A lógica para preencher dados do aluno permanece a mesma
    const usuarioLogado = this.authService.usuarioLogado;
    const estudante = carteirinha.estudante;
    this.usuarioNome = estudante.nome;
    this.matricula = usuarioLogado.usuario.matricula;
    this.curso = estudante.curso;
    this.centro = estudante.centro;
    this.telefone = estudante.telefone;
    this.telefoneUrgencia = estudante.telefoneUrgencia;
    this.espacosCarteirinha = carteirinha.espacos.slice();
    this.semestreInicioFormatted = estudante.semestreInicio ? this.formatDate(estudante.semestreInicio) : '—';
    this.validadeFormatted = this.formatDate(carteirinha.validade);

    this.nomeDoDiaAtual = this.obterNomeDoDia(new Date());
    this.buscarHorariosLivres();
  }

  // MÉTODO buscarHorariosLivres ATUALIZADO
  private buscarHorariosLivres() {
    this.localService.listarLocais().subscribe({
      next: (todosLocais) => {
        const locaisFiltrados = todosLocais.filter(loc => this.espacosCarteirinha.includes(loc.nome));
        if (locaisFiltrados.length === 0) { this.horariosAgrupados = []; return; }
        const numeroDia = new Date().getDay(); // Pega o dia da semana atual

        // Para cada local permitido, chama a API de disponibilidade para o dia de hoje
        const chamadas$ = locaisFiltrados.map(loc =>
          this.horarioService.getDisponibilidade(loc._id, numeroDia).pipe(
            map((slots: Disponibilidade[]) => {
              // Para cada slot retornado, cria um objeto com o intervalo e o nome do local
              return slots
                .filter(s => s.estaDisponivel)
                .map(s => ({
                  intervalo: `${s.horarioInicio} - ${s.horarioFinal}`, // <<< MUDANÇA PRINCIPAL AQUI
                  localNome: loc.nome
                }));
            })
          )
        );

        forkJoin(chamadas$).subscribe({
          next: (listasDeObjetos) => {
            const mapaTemp: { [intervalo: string]: string[] } = {};
            // Agrupa os locais pelo intervalo de tempo
            for (const lista of listasDeObjetos) {
              for (const item of lista) {
                const intervalo = item.intervalo;
                if (!mapaTemp[intervalo]) {
                  mapaTemp[intervalo] = [];
                }
                if (!mapaTemp[intervalo].includes(item.localNome)) {
                  mapaTemp[intervalo].push(item.localNome);
                }
              }
            }
            // Transforma o mapa em um array de HorarioAgrupado
            this.horariosAgrupados = Object.entries(mapaTemp).map(
              ([intervalo, espacosArray]) => ({ intervalo, espacos: espacosArray })
            );
          },
          error: (err) => console.error('Erro ao buscar horários:', err)
        });
      },
      error: (err) => console.error('Erro ao listar locais:', err)
    });
  }
  
  // Seus outros métodos (formatDate, etc.) permanecem os mesmos
  private formatDate(dt: any): string {
    // Se a data for inválida, retorna um placeholder
    if (!dt) { return '—'; }

    const dateObj = dt instanceof Date ? dt : new Date(dt);
    if (isNaN(dateObj.getTime())) {
      return '—';
    }

    // Adiciona o fuso horário para garantir que a data não mude
    const dia = String(dateObj.getUTCDate()).padStart(2, '0');
    const mes = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const ano = dateObj.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  private obterNomeDoDia(date: Date): string {
    const dias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return dias[date.getDay()];
  }
}