import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Adicionado
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Verifique se este caminho está correto!

@Component({
  selector: 'app-tela-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Adicionado CommonModule
  templateUrl: './tela-login.component.html',
  styleUrl: './tela-login.component.css' // Ajustado para styleUrl
})
export class TelaLoginComponent {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    console.log(`Tentando login com: ${this.username}`);
    // Lógica de login (aqui está dummy, mas usa o serviço)
    const loginSuccess = this.auth.loginDummy(this.username, this.password);

    // !! IMPORTANTE !!: Esta lógica precisará ser expandida para
    // verificar se o login foi bem-sucedido e se o usuário é
    // Aluno ou Funcionário para navegar para a tela correta.
    // Por enquanto, ela sempre vai para /visao-geral.
    this.router.navigate(['/visao-geral']);
  }
}