import { Component }         from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tela-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tela-cadastro.component.html',
  styleUrls: ['./tela-cadastro.component.css']
})
export class TelaCadastroComponent {
  constructor(private router: Router) {}

  onSubmit() {
    // enviar o form para a api
    this.router.navigate(['/espera-validacao']);
  }
}
