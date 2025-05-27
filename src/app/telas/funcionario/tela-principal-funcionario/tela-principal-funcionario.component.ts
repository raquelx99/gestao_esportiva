import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FuncionarioTopBarComponent } from '../../../componentes/funcionario-top-bar/funcionario-top-bar.component';

@Component({
  selector: 'app-tela-principal-funcionario',
  standalone: true,
  imports: [FuncionarioTopBarComponent, RouterOutlet, RouterLink], // ATUALIZADO
  templateUrl: './tela-principal-funcionario.component.html',
  styleUrl: './tela-principal-funcionario.component.css'
})
export class TelaPrincipalFuncionarioComponent {

  sidebarAberta: boolean = false;

  constructor() { } 

  toggleSidebar(): void {
    this.sidebarAberta = !this.sidebarAberta;
    console.log('Novo estado da sidebarAberta:', this.sidebarAberta);
  }
}