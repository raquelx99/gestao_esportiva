import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras';

@Component({
  selector: 'app-preview-carteira-validacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-carteira-validacao.component.html',
  styleUrl: './preview-carteira-validacao.component.css'
})
export class PreviewCarteiraValidacaoComponent implements OnInit {
  carteiraId: string | null = null;
  dadosCarteira: CarteiraDetalhes | undefined = undefined;
  abaAtiva: string = 'formulario';


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carteiraId = this.route.snapshot.paramMap.get('id');
    console.log('ID da Carteira para validar:', this.carteiraId);

    if (this.carteiraId) {
      this.dadosCarteira = MOCK_CARTEIRAS.find(c => c.id === this.carteiraId);
    }
    if (!this.dadosCarteira) {
      console.error('Carteira não encontrada com o ID:', this.carteiraId);
    }
  }

  selecionarAba(nomeAba: string): void {
    this.abaAtiva = nomeAba;
  }

  aprovarCarteira(): void {
    console.log(`Carteira ${this.carteiraId} APROVADA`, this.dadosCarteira);
    this.router.navigate(['/funcionario/validacao-resultado'], { state: { status: 'aprovada', id: this.carteiraId, nome: this.dadosCarteira?.nome } });
  }

  rejeitarCarteira(): void {
    console.log(`Carteira ${this.carteiraId} REJEITADA`, this.dadosCarteira);
    this.router.navigate(['/funcionario/validacao-resultado'], { state: { status: 'rejeitada', id: this.carteiraId, nome: this.dadosCarteira?.nome } });
  }
}