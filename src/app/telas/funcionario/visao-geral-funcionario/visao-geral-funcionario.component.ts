import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras';
import { EspacoHorario, MOCK_ESPACOS_HORARIOS } from '../../../core/mocks/mock-horarios'; // Ou do seu mock-horarios.ts

@Component({
  selector: 'app-visao-geral-funcionario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './visao-geral-funcionario.component.html',
  styleUrl: './visao-geral-funcionario.component.css'
})
export class VisaoGeralFuncionarioComponent implements OnInit {
  primeirasCarteirasPendentes: CarteiraDetalhes[] = [];
  temCarteirasPendentes: boolean = false;
  algunsEspacosHorarios: EspacoHorario[] = [];
  temHorariosResumo: boolean = false;
  horariosResumoExpandidos: { [espacoId: string]: boolean } = {};

  // <<< ADICIONE ESTA LINHA ABAIXO >>>
  diasDaSemanaCabecalho: string[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  constructor() { }

  ngOnInit(): void {
    this.primeirasCarteirasPendentes = MOCK_CARTEIRAS.slice(0, 3);
    this.temCarteirasPendentes = this.primeirasCarteirasPendentes.length > 0;
    this.algunsEspacosHorarios = MOCK_ESPACOS_HORARIOS.slice(0, 2).map(espaco => {
      this.horariosResumoExpandidos[espaco.id] = false;
      return espaco;
    });
    this.temHorariosResumo = this.algunsEspacosHorarios.length > 0;

    console.log('Carteiras para resumo:', this.primeirasCarteirasPendentes);
    console.log('Espaços para resumo de horários:', this.algunsEspacosHorarios);
  }

  toggleHorarioResumo(espacoId: string): void {
    if (this.horariosResumoExpandidos.hasOwnProperty(espacoId)) {
      this.horariosResumoExpandidos[espacoId] = !this.horariosResumoExpandidos[espacoId];
      console.log(`Expansão para ${espacoId}:`, this.horariosResumoExpandidos[espacoId]);
    }
  }
}