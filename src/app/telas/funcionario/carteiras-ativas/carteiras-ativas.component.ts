import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras';

interface CarteiraAtivaDisplay extends CarteiraDetalhes {
  espacosArray?: string[];
}

@Component({
  selector: 'app-carteiras-ativas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carteiras-ativas.component.html',
  styleUrl: './carteiras-ativas.component.css'
})
export class CarteirasAtivasComponent implements OnInit {
  listaCompletaCarteirasAtivas: CarteiraAtivaDisplay[] = [];
  carteirasFiltradas: CarteiraAtivaDisplay[] = [];

  constructor() { }

  ngOnInit(): void {
    this.listaCompletaCarteirasAtivas = MOCK_CARTEIRAS.map(carteira => {
      let espacosArr: string[] = [];
      if (carteira.espacosSolicitados) {
        espacosArr = carteira.espacosSolicitados
          .split(',')
          .map(espaco => espaco.trim())
          .filter(espaco => espaco.length > 0);
      }
      return {
        ...carteira,
        isExpanded: carteira.isExpanded || false,
        espacosArray: espacosArr
      };
    });

    this.filtrarCarteiras('');
    console.log('Carteiras ativas carregadas com espacosArray:', this.listaCompletaCarteirasAtivas);
  }

  toggleDetalhes(carteira: CarteiraAtivaDisplay): void {
    carteira.isExpanded = !carteira.isExpanded;
    console.log(`Detalhes para ${carteira.nome} visíveis:`, carteira.isExpanded);
  }

  filtrarCarteiras(termoBuscaInput: string): void {
    const termo = termoBuscaInput.trim().toLowerCase();
    if (!termo) {
      this.carteirasFiltradas = [...this.listaCompletaCarteirasAtivas];
    } else {
      this.carteirasFiltradas = this.listaCompletaCarteirasAtivas.filter(carteira =>
        carteira.nome.toLowerCase().includes(termo)
      );
    }
    console.log('Termo buscado:', termo, 'Resultados na lista filtrada:', this.carteirasFiltradas.length);
  }
}