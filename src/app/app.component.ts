import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelaLoginCadastroComponent } from "./tela-login-cadastro/tela-login-cadastro.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TelaLoginCadastroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestao_esportiva';
}
