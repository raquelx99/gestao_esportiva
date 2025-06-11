import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component'; // Ajuste este caminho!
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras'; // Ajuste este caminho!

@Component({
  selector: 'app-tela-carteira-aluno',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './tela-carteira-aluno.component.html',
  styleUrl: './tela-carteira-aluno.component.css'
})
export class TelaCarteiraAlunoComponent implements OnInit {
  dadosCarteira: CarteiraDetalhes | undefined;
  isExpired: boolean = false;
  dataAtual: Date = new Date();

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (MOCK_CARTEIRAS.length > 0) {
      // Para simular, vamos pegar um aluno e talvez forçar um estado expirado para teste
      // this.dadosCarteira = MOCK_CARTEIRAS[0]; // Carteira Válida (João)
      this.dadosCarteira = { // Carteira Expirada para Teste (Ciclana)
        ...MOCK_CARTEIRAS[0], // Pega os dados da Ciclana
        validade: '31/12/2026' // Define uma data de validade passada
      };
      
      this.verificarValidade();
    } else {
      console.error("Nenhum dado mockado de carteira encontrado!");
    }
    console.log('Dados da carteira para exibição:', this.dadosCarteira);
    console.log('Expirada:', this.isExpired);
  }

  verificarValidade(): void {
    if (this.dadosCarteira && this.dadosCarteira.validade) {
      const partesData = this.dadosCarteira.validade.split('/');
      if (partesData.length === 3) {
        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1;
        const ano = parseInt(partesData[2], 10);
        const dataValidade = new Date(ano, mes, dia);
        dataValidade.setHours(23, 59, 59, 999);

        if (this.dataAtual > dataValidade) {
          this.isExpired = true;
        } else {
          this.isExpired = false;
        }
      }
    }
  }

  get espacosArray(): string[] {
    if (this.dadosCarteira && this.dadosCarteira.espacosSolicitados) {
      return this.dadosCarteira.espacosSolicitados.split(',').map(espaco => espaco.trim()).filter(espaco => espaco.length > 0);
    }
    return [];
  }

  iniciarRenovacao(): void {
    console.log('Iniciando fluxo de renovação para carteira ID:', this.dadosCarteira?.id);
    this.router.navigate(['/aluno/renovacao-confirmacao']);
  }
}