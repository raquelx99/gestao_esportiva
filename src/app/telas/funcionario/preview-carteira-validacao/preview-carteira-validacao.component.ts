import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Carteirinha } from '../../../entity/Carteirinha';
import { CarteirinhaService } from '../../../services/carteirinha.service';

@Component({
  selector: 'app-preview-carteira-validacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-carteira-validacao.component.html',
  styleUrl: './preview-carteira-validacao.component.css'
})
export class PreviewCarteiraValidacaoComponent implements OnInit {
  fotoUrlCompleta: string | null = null;
  carteiraId: string | null = null;
  dadosCarteira: Carteirinha | null = null;
  abaAtiva: string = 'formulario';

  constructor(
    private carteirinhaService: CarteirinhaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carteiraId = this.route.snapshot.paramMap.get('id');
    if (this.carteiraId) {
      this.carteirinhaService.getCarteirinhaPorId(this.carteiraId).subscribe({
        next: (carteira) => {
          this.dadosCarteira = carteira;
          if (carteira.urlFoto) {
            this.fotoUrlCompleta = 'http://localhost:3000' + carteira.urlFoto;
          }
        },
        error: (err) => console.error('Erro ao buscar carteira:', err)
      });
    }
  }

  selecionarAba(nomeAba: string): void { this.abaAtiva = nomeAba; }

  aprovarCarteira(): void {
    if (!this.carteiraId) return;
    this.carteirinhaService.aprovarCarteirinha(this.carteiraId).subscribe({
      next: () => {
        console.log(`Carteira ${this.carteiraId} APROVADA no back-end.`);
        // CORREÇÃO: Enviando dados via queryParams
        this.router.navigate(['/funcionario/validacao-resultado'], {
          queryParams: {
            status: 'aprovada',
            id: this.carteiraId,
            nome: this.dadosCarteira?.estudante?.user?.nome
          }
        });
      },
      error: (err) => console.error('Erro ao aprovar carteira:', err)
    });
  }

  rejeitarCarteira(): void {
    if (!this.carteiraId) return;
    this.carteirinhaService.rejeitarCarteirinha(this.carteiraId).subscribe({
      next: () => {
        console.log(`Carteira ${this.carteiraId} REJEITADA no back-end.`);
        // CORREÇÃO: Enviando dados via queryParams
        this.router.navigate(['/funcionario/validacao-resultado'], {
          queryParams: {
            status: 'rejeitada',
            id: this.carteiraId,
            nome: this.dadosCarteira?.estudante?.user?.nome
          }
        });
      },
      error: (err) => console.error('Erro ao rejeitar carteira:', err)
    });
  }
}