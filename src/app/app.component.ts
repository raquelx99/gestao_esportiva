import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // <--- Apenas RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Pode manter, não atrapalha
    RouterOutlet  // <--- Apenas o RouterOutlet aqui! Remova TelaLoginCadastroComponent.
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestao-esportiva-frontend';
}