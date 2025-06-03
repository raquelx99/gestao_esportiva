// src/app/telas/tela-login/tela-login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CarteirinhaService } from '../../services/carteirinha.service';

@Component({
  selector: 'app-tela-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './tela-login.component.html',
  styleUrls: ['./tela-login.component.css']
})
export class TelaLoginComponent {
  matricula = '';
  senha     = '';

  private authService = inject(AuthService);
  private carteirinhaService = inject(CarteirinhaService);
  constructor(private router: Router) {}

  onSubmit() {
    this.authService.login(this.matricula, this.senha).subscribe({
      next: (res) => {
        this.authService.usuarioLogado = res;

        const role = res.usuario.role;

        if (role === 'estudante') {
          const carteirinha = res.carteirinha;

          if (!carteirinha) {
            this.router.navigate(['/cadastro']);
            return;
          }

          if (
            carteirinha.status === 'aprovado' &&
            carteirinha.liberadoPosValidacao
          ) {
            this.router.navigate(['/visao-geral']);
          }
          else {
            this.router.navigate(['/espera-validacao']);
          }
        }
        else if (role === 'funcionario') {
          this.router.navigate(['/funcionario']);
        }
        else {
          this.router.navigate(['/boas-vindas']);
        }
      },
      error: () => alert('Erro no login')
    });
  }
}