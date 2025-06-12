import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component';
import { AuthService } from '../../../services/auth.service';
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { Carteirinha } from '../../../entity/Carteirinha';

@Component({
  selector: 'app-tela-carteira-aluno',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './tela-carteira-aluno.component.html',
  styleUrl: './tela-carteira-aluno.component.css'
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
  dataAtual: Date = new Date();

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

    const estudanteEmMemoria = usuarioLogado.carteirinha.estudante._id;

    this.carteirinhaService
      .getCarteirinhaPorEstudante(estudanteEmMemoria)
      .subscribe({
        next: (carteirinha: Carteirinha) => {
          console.log(carteirinha);
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

    this.verificarValidade();
    console.log('Expirada:', this.isExpired);
  }

  private preencherTelaComCarteirinha(carteirinha: any) {
    const usuarioLogado = this.authService.usuarioLogado;
    const estudante = carteirinha.estudante;

    this.usuarioNome = estudante.nome;
    this.matricula = usuarioLogado.usuario.matricula;
    this.curso = estudante.curso;
    this.centro = estudante.centro;
    this.telefone = estudante.telefone;
    this.telefoneUrgencia = estudante.telefoneUrgencia;
    this.espacosCarteirinha = carteirinha.espacos.slice();

    this.semestreInicioFormatted = estudante.semestreInicio
      ? this.formatDate(estudante.semestreInicio)
      : '—';
    this.validadeFormatted = this.formatDate(carteirinha.validade);
  }

  verificarValidade(): void {
    if (this.validadeFormatted) {
      const partesData = this.validadeFormatted.split('/');
      if (partesData.length === 3) {
        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1;
        const ano = parseInt(partesData[2], 10);
        const dataValidade = new Date(ano, mes, dia);
        dataValidade.setHours(23, 59, 59, 999);

        this.isExpired = this.dataAtual > dataValidade;
      }
    }
  }

  private formatDate(dt: any): string {
    const dateObj = dt instanceof Date ? dt : new Date(dt);
    if (isNaN(dateObj.getTime())) {
      return '—';
    }
    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const ano = dateObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  get espacosArray(): string[] {
    if (this.espacosCarteirinha && Array.isArray(this.espacosCarteirinha)) {
      return this.espacosCarteirinha;
    }
    return [];
  }

  iniciarRenovacao(): void {
    console.log('Iniciando fluxo de renovação');
    this.router.navigate(['/aluno/renovacao-confirmacao']);
  }
}
