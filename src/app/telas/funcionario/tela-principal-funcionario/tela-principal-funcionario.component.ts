import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FuncionarioTopBarComponent } from '../../../componentes/funcionario-top-bar/funcionario-top-bar.component'; // NOVO

@Component({
  selector: 'app-tela-principal-funcionario',
  standalone: true,
  imports: [FuncionarioTopBarComponent, RouterOutlet, RouterLink], // ATUALIZADO
  templateUrl: './tela-principal-funcionario.component.html',
  styleUrl: './tela-principal-funcionario.component.css'
})
export class TelaPrincipalFuncionarioComponent {

}