import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component'; // Ajuste o caminho se necessário
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-tela-confirmacao-renovacao',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './tela-confirmacao-renovacao.component.html',
  styleUrl: './tela-confirmacao-renovacao.component.css'
})
export class TelaConfirmacaoRenovacaoComponent implements OnInit {
  dadosCarteiraAtual: CarteiraDetalhes | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (MOCK_CARTEIRAS.length > 0) {
      this.dadosCarteiraAtual = MOCK_CARTEIRAS[0];
      // console.log('Dados da carteira atual para confirmação:', this.dadosCarteiraAtual);
    } else {
      console.error("Mock de carteiras não encontrado para TelaConfirmacaoRenovacao.");
    }
  }

  confirmarDadosIguais(): void {
    console.log('Aluno confirmou que os dados são os mesmos. Simulando envio para validação...');
    this.router.navigate(['/espera-validacao'], { state: { mensagem: 'Sua solicitação de renovação foi enviada e está em análise.', origem: 'renovacao' } });
  }

  dadosMudaram(): void {
    console.log('Aluno indicou que os dados mudaram. Indo para formulário de atualização...');
    // A rota para TelaRenovacaoFormularioComponent deve corresponder ao que está em app.routes.ts
    this.router.navigate(['/aluno/renovacao-formulario']);
  }
}