import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <<< IMPORTAR

@Component({
  selector: 'app-tela-login-cadastro',
  standalone: true, // <<< ADICIONAR
  imports: [RouterLink], // <<< ADICIONAR
  templateUrl: './tela-login-cadastro.component.html',
  styleUrl: './tela-login-cadastro.component.css' // <<< Use styleUrl (singular) para consistência
})
export class TelaLoginCadastroComponent {

}