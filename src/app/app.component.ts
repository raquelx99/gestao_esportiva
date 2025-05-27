import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelaLoginCadastroComponent } from './telas/tela-login-cadastro/tela-login-cadastro.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestao_esportiva';
}