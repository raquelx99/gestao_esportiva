import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspacoHorario, MOCK_ESPACOS_HORARIOS } from '../../../core/mocks/mock-horarios';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit {
  listaCompletaEspacos: EspacoHorario[] = []; 
  espacosFiltrados: EspacoHorario[] = [];

  diasDaSemanaCabecalho: string[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  constructor() { }

  ngOnInit(): void {
    this.listaCompletaEspacos = MOCK_ESPACOS_HORARIOS.map(espaco => ({
      ...espaco,
      isExpanded: espaco.isExpanded || false
    }));
    this.filtrarEspacos('');
    console.log('Espaços e horários carregados:', this.listaCompletaEspacos);
  }

  toggleDetalhesEspaco(espaco: EspacoHorario): void {
    espaco.isExpanded = !espaco.isExpanded;
    console.log(`Detalhes para ${espaco.nomeDisplay} visíveis:`, espaco.isExpanded);
  }

  filtrarEspacos(termoBuscaInput: string): void {
    const termo = termoBuscaInput.trim().toLowerCase();

    if (!termo) {
      this.espacosFiltrados = [...this.listaCompletaEspacos];
    } else {
      this.espacosFiltrados = this.listaCompletaEspacos.filter(espaco =>
        espaco.nomeDisplay.toLowerCase().includes(termo)
      );
    }
    console.log('Termo buscado (horários):', termo, 'Resultados na lista filtrada:', this.espacosFiltrados.length);
  }
}