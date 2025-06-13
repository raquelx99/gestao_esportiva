import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { Carteirinha } from '../../../entity/Carteirinha';

interface CarteiraAtivaDisplay extends Carteirinha {
  isExpanded?: boolean;
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

  constructor(private carteirinhaService: CarteirinhaService) { }

  ngOnInit(): void {

    const statusDesejado = 'aprovado';
    this.carteirinhaService.getCarteirinhasPorStatus(statusDesejado).subscribe({
      next: (carteirinhas: Carteirinha[]) => {

        this.listaCompletaCarteirasAtivas = carteirinhas.map(carteira => {
          const espacosArr: string[] = Array.isArray(carteira.espacos)
            ? carteira.espacos
            : (typeof carteira.espacos === 'string'
                ? (carteira.espacos as string).split(',').map(e => e.trim()).filter(e => e.length > 0)
                : []);

          return {
            _id: carteira._id,
            estudante: carteira.estudante,
            validade: carteira.validade,
            espacos: Array.isArray(carteira.espacos) ? carteira.espacos : [],
            status: carteira.status,
            temFoto: carteira.temFoto,
            urlFoto: carteira.urlFoto,
            liberadoPosValidacao: carteira.liberadoPosValidacao,
            dataRequisicao: carteira.dataRequisicao,
            isExpanded: false,
            espacosArray: espacosArr
          };
        });

        this.filtrarCarteiras('');
        console.log('Carteiras ativas carregadas:', this.listaCompletaCarteirasAtivas);
      },
      error: err => {
        console.error('Erro ao buscar carteirinhas por status:', err);
      }
    });
  }

  toggleDetalhes(carteira: CarteiraAtivaDisplay): void {
    carteira.isExpanded = !carteira.isExpanded;
    console.log(`Detalhes para ${carteira.estudante.user.nome} visíveis:`, carteira.isExpanded);
  }

  filtrarCarteiras(termoBuscaInput: string): void {
    const termo = termoBuscaInput.trim().toLowerCase();
    if (!termo) {
      this.carteirasFiltradas = [...this.listaCompletaCarteirasAtivas];
    } else {
      this.carteirasFiltradas = this.listaCompletaCarteirasAtivas.filter(carteira =>
        carteira.estudante.user.nome.toLowerCase().includes(termo)
      );
    }
    console.log('Termo buscado:', termo, 'Resultados:', this.carteirasFiltradas.length);
  }
}
