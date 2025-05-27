import { Component, OnInit } from '@angular/core'; // Adicione OnInit
import { CommonModule } from '@angular/common';
// Importar a nova estrutura e os dados mockados
import { EspacoHorario, MOCK_ESPACOS_HORARIOS } from '../../../core/mocks/mock-horarios';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit {
  listaDeEspacos: EspacoHorario[] = [];

  diasDaSemanaCabecalho: string[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  constructor() { }

  ngOnInit(): void {
    this.listaDeEspacos = MOCK_ESPACOS_HORARIOS.map(espaco => ({
      ...espaco,
      isExpanded: espaco.isExpanded || false // Garante que comece fechado
    }));
    console.log('Espaços e horários carregados:', this.listaDeEspacos);
  }

  toggleDetalhesEspaco(espaco: EspacoHorario): void {
    espaco.isExpanded = !espaco.isExpanded;
    console.log(`Detalhes para ${espaco.nomeDisplay} visíveis:`, espaco.isExpanded);
  }

}