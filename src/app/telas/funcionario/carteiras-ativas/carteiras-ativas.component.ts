import { Component, OnInit } from '@angular/core'; // Adicionado OnInit
import { CommonModule } from '@angular/common';
// Importar os dados mockados e a interface
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras'; // Ajuste o caminho se sua pasta mocks não estiver em core

@Component({
  selector: 'app-carteiras-ativas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carteiras-ativas.component.html',
  styleUrl: './carteiras-ativas.component.css'
})
export class CarteirasAtivasComponent implements OnInit { // Implementar OnInit
  // Lista para as carteiras que serão exibidas
  listaDeCarteirasAtivas: CarteiraDetalhes[] = [];

  constructor() { }

  ngOnInit(): void {
    // Inicializa a lista de carteiras
    // Mapeamos para garantir que cada item tenha a propriedade 'isExpanded'
    this.listaDeCarteirasAtivas = MOCK_CARTEIRAS.map(carteira => ({
      ...carteira,
      isExpanded: false // Todas começam fechadas por padrão
    }));
    console.log('Carteiras ativas carregadas (com estado de expansão):', this.listaDeCarteirasAtivas);
  }

  // Método para alternar a visibilidade dos detalhes de uma carteira específica
  toggleDetalhes(carteira: CarteiraDetalhes): void {
    carteira.isExpanded = !carteira.isExpanded;
    console.log(`Detalhes para ${carteira.nome} visíveis:`, carteira.isExpanded);
  }
}