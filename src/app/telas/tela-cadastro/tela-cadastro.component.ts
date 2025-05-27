import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Essencial para ngForm
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tela-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Mantemos os imports dela
  templateUrl: './tela-cadastro.component.html',
  styleUrl: './tela-cadastro.component.css' // Ajustado para styleUrl
})
export class TelaCadastroComponent {
  constructor(private router: Router) {}

  onSubmit() {
    // Aqui virá a lógica para enviar o form para a api...
    console.log("Formulário submetido!"); // Adicionei um log para ajudar a testar
    this.router.navigate(['/espera-validacao']); // Mantemos a navegação dela
  }
}