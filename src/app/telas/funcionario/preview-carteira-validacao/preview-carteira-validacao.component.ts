import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CarteiraDetalhes } from '../../../core/mocks/mock-carteiras';
import { Carteirinha } from '../../../entity/Carteirinha';
import { AuthService } from '../../../services/auth.service';
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
    console.log('ID da Carteira para validar:', this.carteiraId);

    if (this.carteiraId) {
      this.carteirinhaService.getCarteirinhaPorId(this.carteiraId).subscribe({
        next: (carteira) => {
          this.dadosCarteira = carteira;
          if (!this.dadosCarteira) {
            console.error('Carteira não encontrada com o ID:', this.carteiraId);
          } else {
            if (carteira.urlFoto) {
              this.fotoUrlCompleta = 'http://localhost:3000' + carteira.urlFoto;
            } else {
              this.fotoUrlCompleta = null;
            }
          }
          console.log(this.dadosCarteira);
        },
        error: (err) => {
          console.error('Erro ao buscar carteira:', err);
        }
      });
    }
    else {
      console.error('ID da carteira não fornecido na rota.');
      this.router.navigate(['/funcionario/validar-carteiras']);
    }
  }

  selecionarAba(nomeAba: string): void {
    this.abaAtiva = nomeAba;
  }

  aprovarCarteira(): void {
    this.carteirinhaService.aprovarCarteirinha(this.carteiraId!).subscribe({
      next: () => {
      console.log(`Carteira ${this.carteiraId} APROVADA`, this.dadosCarteira);  
      this.router.navigate(['/funcionario/validacao-resultado']);
      },
      error: (err) => {
      console.error('Erro ao aprovar carteira:', err);
      }
    });
  }

  rejeitarCarteira(): void {
    console.log(`Carteira ${this.carteiraId} REJEITADA`, this.dadosCarteira);
    this.carteirinhaService.rejeitarCarteirinha(this.carteiraId!).subscribe({
      next: () => {
        this.router.navigate(['/funcionario/validacao-resultado']);
      },
      error: (err) => {
        console.error('Erro ao rejeitar carteira:', err);
      }
    });
  }
}