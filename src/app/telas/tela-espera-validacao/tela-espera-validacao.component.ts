import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { CarteirinhaService } from '../../services/carteirinha.service';
import { AuthService }        from '../../services/auth.service';
import { TopBarComponent } from "../../componentes/top-bar/top-bar.component";

type Status = 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-tela-espera-validacao',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './tela-espera-validacao.component.html',
  styleUrls: ['./tela-espera-validacao.component.css']
})
export class TelaEsperaValidacaoComponent implements OnInit {
  status: Status = 'pending';
  liberadoPosValidacao = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private carteirinhaService: CarteirinhaService
  ) {}

  ngOnInit() {

    if (!this.authService.usuarioLogado) {
      this.router.navigate(['/boas-vindas']);
      return;
    }

    const carteirinha = this.authService.usuarioLogado.carteirinha;

    if (!carteirinha) {
      this.router.navigate(['/cadastro']);
      return;
    }

    this.liberadoPosValidacao = carteirinha.liberadoPosValidacao || false;

    if (carteirinha.status === 'pendente') {
      this.status = 'pending';
    }
    else if (carteirinha.status === 'aprovado' || carteirinha.status === 'expirado') {
      if (this.liberadoPosValidacao) {
        this.router.navigate(['/visao-geral']);
        return;
      }
      this.status = 'approved';
    }
    else if (carteirinha.status === 'rejeitado') {
      this.status = 'rejected';
    }
  }

  onAdvance() {
    const estudanteId = this.authService.usuarioLogado.carteirinha.estudante._id;
    if (!estudanteId) {
      console.error('ID do estudante não encontrado.');
      return;
    }

    this.carteirinhaService.marcarComoLiberado(estudanteId).subscribe({
      next: () => {
        this.authService.usuarioLogado.carteirinha.liberadoPosValidacao = true;

        this.router.navigate(['/visao-geral']);
      },
      error: (err) => {
        console.error('Erro ao liberar acesso:', err);
      }
    });
  }

  onRetry() {
    this.router.navigate(['/cadastro']);
  }
}
