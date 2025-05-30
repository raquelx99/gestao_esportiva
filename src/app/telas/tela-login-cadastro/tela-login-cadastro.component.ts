import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Mantemos o RouterModule

@Component({
  selector: 'app-tela-login-cadastro',
  standalone: true,
  imports: [RouterModule], // Mantemos o RouterModule
  templateUrl: './tela-login-cadastro.component.html',
  styleUrl: './tela-login-cadastro.component.css' // Ajustado para styleUrl
})
export class TelaLoginCadastroComponent {

}