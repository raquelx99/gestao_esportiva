import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // <<< Importar ActivatedRoute
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { Carteirinha } from '../../../entity/Carteirinha';

@Component({
  selector: 'app-confirmacao-validacao',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmacao-validacao.component.html',
  styleUrl: './confirmacao-validacao.component.css'
})
export class ConfirmacaoValidacaoComponent implements OnInit {
  status: 'aprovada' | 'rejeitada' | string | undefined;
  nomeCarteira: string | undefined;
  idCarteiraProcessada: string | undefined;
  proximaCarteiraId: string | null = null;
  mensagem: string = '';
  corCard: string = '';

  // Injetar ActivatedRoute para ler os parâmetros da rota
  constructor(
    private router: Router,
    private route: ActivatedRoute, // <<< Injetado aqui
    private carteirinhaService: CarteirinhaService
  ) { }

  ngOnInit(): void {
    // CORREÇÃO: Lemos os dados a partir dos queryParams da URL
    this.route.queryParams.subscribe(params => {
      console.log('Query params recebidos na confirmação:', params);
      if (params['status'] && params['id']) {
        this.status = params['status'];
        this.idCarteiraProcessada = params['id'];
        this.nomeCarteira = params['nome'];
      }

      // Lógica para definir a mensagem
      if (this.status === 'aprovada') {
        this.mensagem = `A carteira de ${this.nomeCarteira || `ID ${this.idCarteiraProcessada}`} foi APROVADA com sucesso!`;
        this.corCard = 'approved';
      } else if (this.status === 'rejeitada') {
        this.mensagem = `A carteira de ${this.nomeCarteira || `ID ${this.idCarteiraProcessada}`} foi REJEITADA.`;
        this.corCard = 'rejected';
      } else {
        this.mensagem = 'Resultado da validação desconhecido. Por favor, volte para a lista.';
        this.corCard = 'unknown';
      }
    });

    this.carregarProximaCarteiraPendente();
  }

  carregarProximaCarteiraPendente(): void {
    this.carteirinhaService.getCarteirinhasPendentes().subscribe({
      next: (carteiras) => {
        if (carteiras && carteiras.length > 0) {
          // A próxima carteira a ser avaliada é a primeira da lista de pendentes
          this.proximaCarteiraId = carteiras[0]?._id || null;
        } else {
          this.proximaCarteiraId = null;
          console.log('Não há mais carteiras pendentes para avaliar.');
        }
      },
      error: (err) => { this.proximaCarteiraId = null; console.error('Erro ao buscar carteiras pendentes:', err); }
    });
  }

  voltarParaLista(): void {
    this.router.navigate(['/funcionario/validar-carteiras']);
  }

  avaliarProxima(): void {
    if (this.proximaCarteiraId) {
      console.log('Navegando para a próxima carteira:', this.proximaCarteiraId);
      this.router.navigate(['/funcionario/validar-carteiras', this.proximaCarteiraId]);
    } else {
      this.voltarParaLista();
    }
  }
}