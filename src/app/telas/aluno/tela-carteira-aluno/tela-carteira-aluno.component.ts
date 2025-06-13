// src/app/telas/tela-carteira-aluno/tela-carteira-aluno.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { TopBarComponent }   from '../../../componentes/top-bar/top-bar.component';
import { AuthService }       from '../../../services/auth.service';
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { Carteirinha }       from '../../../entity/Carteirinha';

@Component({
  selector: 'app-tela-carteira-aluno',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './tela-carteira-aluno.component.html',
  styleUrls: ['./tela-carteira-aluno.component.css']
})
export class TelaCarteiraAlunoComponent implements OnInit {

  usuarioNome!: string;
  matricula!: string;
  curso!: string;
  centro!: string;
  telefone!: string;
  telefoneUrgencia!: string;
  espacosCarteirinha: string[] = [];
  semestreInicioFormatted!: string;
  validadeFormatted!: string;

  isExpired: boolean = false;

  constructor(
    private authService: AuthService,
    private carteirinhaService: CarteirinhaService,
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

    const estudanteId = usuarioLogado.carteirinha?.estudante?._id;
    if (!estudanteId) {
      console.error('ID do estudante não encontrado em memória.');
      this.router.navigate(['/cadastro']);
      return;
    }

    this.carteirinhaService.getCarteirinhaPorEstudante(estudanteId).subscribe({
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
    const estudante = carteirinha.estudante;
    const usuarioLogado = this.authService.usuarioLogado;

    this.usuarioNome = estudante.user.nome;
    this.matricula = usuarioLogado.user.matricula;
    this.curso = estudante.curso;
    this.centro = estudante.centro;
    this.telefone = estudante.telefone;
    this.telefoneUrgencia = estudante.telefoneUrgencia;
    this.espacosCarteirinha = carteirinha.espacos.slice();

    this.semestreInicioFormatted = estudante.semestreInicio
      ? this.formatDate(estudante.semestreInicio)
      : '—';

    this.validadeFormatted = carteirinha.validade
      ? this.formatDate(carteirinha.validade)
      : '—';

    if (carteirinha.status === 'expirado') {
      this.isExpired = true;
    } else {
      this.isExpired = false;
    }

  }

  private formatDate(dt: string | Date): string {
    const dateObj = dt instanceof Date ? dt : new Date(dt);
    if (isNaN(dateObj.getTime())) {
      return '—';
    }
    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const ano = dateObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  iniciarRenovacao(): void {
    console.log('Iniciando fluxo de renovação');
    this.router.navigate(['/aluno/renovacao-confirmacao']);
  }
}
