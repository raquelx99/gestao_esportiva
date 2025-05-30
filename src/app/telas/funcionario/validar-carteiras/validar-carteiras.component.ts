import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras';

@Component({
  selector: 'app-validar-carteiras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './validar-carteiras.component.html',
  styleUrl: './validar-carteiras.component.css'
})
export class ValidarCarteirasComponent implements OnInit {
  listaDeCarteiras: CarteiraDetalhes[] = [];

  constructor() { }

  ngOnInit(): void {
    this.listaDeCarteiras = MOCK_CARTEIRAS;
    console.log('Carteiras para validar carregadas:', this.listaDeCarteiras);
  }
}