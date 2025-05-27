import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tela-login',
  standalone: true, // <<< ADICIONAR
  imports: [CommonModule], // <<< ADICIONAR (e no futuro, FormsModule/ReactiveFormsModule)
  templateUrl: './tela-login.component.html',
  styleUrl: './tela-login.component.css'
})
export class TelaLoginComponent {

}