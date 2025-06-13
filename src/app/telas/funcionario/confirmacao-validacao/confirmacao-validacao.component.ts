import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  listaDeCarteiras: Carteirinha[] = [];

  mensagem: string = '';
  corCard: string = '';

  constructor(private router: Router,
  private carteirinhaService: CarteirinhaService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {status: string, id: string, nome?: string};

    if (state) {
      this.status = state.status;
      this.idCarteiraProcessada = state.id;
      this.nomeCarteira = state.nome;
    }
  }

  ngOnInit(): void {
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

    // carregar lista do backend
    this.carteirinhaService.getCarteirinhasPendentes().subscribe({
      next: (carteiras) => {
        this.listaDeCarteiras = carteiras;
        console.log('Lista de carteiras pendentes carregada:', this.listaDeCarteiras);
      },
      error: (err) => {
        console.error('Erro ao buscar carteiras pendentes:', err);
      }
    });

    console.log('Estado recebido na confirmação:', this.status, this.idCarteiraProcessada, this.nomeCarteira);
  }

  voltarParaLista(): void {
    console.log('Voltando para a lista de validação.');
    this.router.navigate(['/funcionario/validar-carteiras']);
  }

  avaliarProxima(): void {
    console.log('Botão "Avaliar próxima" clicado.');

    if (!this.idCarteiraProcessada) {
      this.voltarParaLista();
      return;
    }

    const indiceAtual = this.listaDeCarteiras.findIndex(c => c._id === this.idCarteiraProcessada);

    if (indiceAtual !== -1 && indiceAtual < this.listaDeCarteiras.length - 1) {
      const proximaCarteira = this.listaDeCarteiras[indiceAtual + 1];
      console.log('Próxima carteira para avaliar:', proximaCarteira);

      this.router.navigate(['/funcionario/validar-carteiras', proximaCarteira._id], {
        state: {
          id: proximaCarteira._id,
          nome: proximaCarteira.estudante?.user?.nome || 'Desconhecido',
          status: 'pendente'
        }
      });
    } else {
      console.log('Não há próxima carteira na lista do backend ou ID não encontrado. Voltando para a lista.');
      this.voltarParaLista();
    }
  }
}