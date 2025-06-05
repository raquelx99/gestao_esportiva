// src/app/telas/tela-visao-geral/tela-visao-geral.component.ts

import { Component, OnInit }            from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { Router, RouterModule }         from '@angular/router';
import { forkJoin, Observable }         from 'rxjs';
import { map }                          from 'rxjs/operators';

import { TopBarComponent }              from '../../componentes/top-bar/top-bar.component';
import { AuthService }                  from '../../services/auth.service';
import {
  HorarioService,
  Disponibilidade
} from '../../services/horarioService';
import { CarteirinhaService }           from '../../services/carteirinha.service';
import { LocalService }          from '../../services/localService';

import { Estudante }    from '../../entity/Estudante';
import { Carteirinha }  from '../../entity/Carteirinha';
import { Local }  from '../../entity/Local';

interface HorarioAgrupado {
  hora: string;
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

  usuarioNome!: string;
  matricula!: string;
  curso!: string;
  centro!: string;
  telefone!: string;
  telefoneUrgencia!: string;
  espacosCarteirinha: string[] = [];
  semestreInicioFormatted!: string;
  validadeFormatted!: string;

  // ==== Para horários livres ====
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
    if (!usuarioLogado) {
      this.router.navigate(['/boas-vindas']);
      return;
    }

    const perfil = usuarioLogado.perfil;
    if (!perfil || perfil.tipo !== 'estudante' || !perfil.dados) {
      this.router.navigate(['/boas-vindas']);
      return;
    }

    const estudanteEmMemoria = perfil.dados as Estudante & { _id: string };

    this.carteirinhaService
      .getCarteirinhaPorEstudante(estudanteEmMemoria._id)
      .subscribe({
        next: (carteirinha: Carteirinha) => {
          if (!carteirinha) {
            this.router.navigate(['/cadastro']);
            return;
          }

          this.preencherTelaComCarteirinha(carteirinha);
        },
        error: (err) => {
          console.error('Erro ao buscar carteirinha:', err);
          this.router.navigate(['/cadastro']);
        }
      });
  }

  private preencherTelaComCarteirinha(carteirinha: Carteirinha) {
  
    const estudante: Estudante = carteirinha.estudante;

    this.usuarioNome        = estudante.user.nome;
    this.matricula          = estudante.matricula;
    this.curso              = estudante.curso;
    this.centro             = estudante.centro;
    this.telefone           = estudante.telefone;
    this.telefoneUrgencia   = estudante.telefoneUrgencia;
    this.espacosCarteirinha = carteirinha.espacos.slice();

    this.semestreInicioFormatted = estudante.semestreInicio
      ? this.formatDate(estudante.semestreInicio)
      : '—';
    this.validadeFormatted = this.formatDate(carteirinha.validade);

    this.nomeDoDiaAtual = this.obterNomeDoDia(new Date());

    this.buscarHorariosLivres();
  }

  private buscarHorariosLivres() {
    this.localService.listarLocais().subscribe({
      next: (todosLocais: Local[]) => {
        const locaisFiltrados = todosLocais.filter(loc =>
          this.espacosCarteirinha.includes(loc.nome)
        );

        if (locaisFiltrados.length === 0) {
          this.horariosAgrupados = [];
          return;
        }

        const numeroDia = this.nomeSemanaParaNumero(this.nomeDoDiaAtual);
        if (numeroDia === null) {
          console.error('Dia inválido para busca de horários:', this.nomeDoDiaAtual);
          this.horariosAgrupados = [];
          return;
        }

        const chamadas: Observable<{ horarioInicio: string; localNome: string }[]>[] =
          locaisFiltrados.map(loc => 
            this.horarioService.getDisponibilidade(loc._id, numeroDia).pipe(
              map((slots: Disponibilidade[]) => {
                return slots
                  .filter(s => s.estaDisponivel)
                  .map(s => ({
                    horarioInicio: s.horarioInicio,
                    localNome: loc.nome
                  }));
              })
            )
          );

        forkJoin(chamadas).subscribe({
          next: (listasDeObjetos) => {

            const mapaTemp: { [hora: string]: string[] } = {};

            for (const listaLoc of listasDeObjetos) {
              for (const item of listaLoc) {
                const hora = item.horarioInicio;
                if (!mapaTemp[hora]) {
                  mapaTemp[hora] = [];
                }
                if (!mapaTemp[hora].includes(item.localNome)) {
                  mapaTemp[hora].push(item.localNome);
                }
              }
            }

            this.horariosAgrupados = Object.entries(mapaTemp).map(
              ([hora, espacosArray]) => ({ hora, espacos: espacosArray })
            );
          },
          error: (err) => {
            console.error('Erro ao buscar horários (forkJoin):', err);
            this.horariosAgrupados = [];
          }
        });
      },
      error: (err) => {
        console.error('Erro ao listar locais:', err);
        this.horariosAgrupados = [];
      }
    });
  }

  private formatDate(dt: Date): string {
    const dia = String(dt.getDate()).padStart(2, '0');
    const mes = String(dt.getMonth() + 1).padStart(2, '0');
    const ano = dt.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  private nomeSemanaParaNumero(nomeDoDia: string): number | null {
    switch (nomeDoDia.toLowerCase()) {
      case 'domingo':       return 0;
      case 'segunda-feira': return 1;
      case 'terça-feira':   return 2;
      case 'quarta-feira':  return 3;
      case 'quinta-feira':  return 4;
      case 'sexta-feira':   return 5;
      case 'sábado':        return 6;
      default: return null;
    }
  }

  private obterNomeDoDia(date: Date): string {
    const diaSemana = date.getDay();
    switch (diaSemana) {
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
}
