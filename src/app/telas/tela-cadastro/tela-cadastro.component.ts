import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // É bom ter para *ngIf, *ngFor, etc.

@Component({
  selector: 'app-tela-cadastro',
  standalone: true, // <<< ADICIONAR
  imports: [CommonModule], // <<< ADICIONAR (e no futuro, FormsModule/ReactiveFormsModule)
  templateUrl: './tela-cadastro.component.html',
  styleUrl: './tela-cadastro.component.css'
})
export class TelaCadastroComponent {

}