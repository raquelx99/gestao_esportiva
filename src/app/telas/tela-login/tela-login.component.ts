// src/app/telas/tela-login/tela-login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

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
  constructor(private router: Router) {}

  onSubmit() {
  this.authService.login(this.matricula, this.senha).subscribe({
    next: (res) => {
      console.log('Login realizado:', res);
      const role = res.usuario.role;

      if (role === 'estudante') {
        this.router.navigate(['/visao-geral']);
      } else if (role === 'funcionario') {
        this.router.navigate(['/funcionario']);
      }
    },
    error: (err) => {
      console.error('Erro no login:', err);
    }
  });
}
}