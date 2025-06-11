import { Component, Output, EventEmitter } from '@angular/core'; // ADICIONE Output e EventEmitter
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-top-bar',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './funcionario-top-bar.component.html',
  styleUrl: './funcionario-top-bar.component.css'
})
export class FuncionarioTopBarComponent {

  @Output() menuToggle = new EventEmitter<void>();

  constructor() { }

  onMenuButtonClick(): void {
    this.menuToggle.emit();
    console.log('Botão de menu no top-bar clicado, emitindo evento menuToggle');
  }
}