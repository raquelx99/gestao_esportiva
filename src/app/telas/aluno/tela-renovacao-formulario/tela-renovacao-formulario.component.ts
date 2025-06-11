import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component';
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras';

type DadosRenovacaoForm = Partial<Omit<CarteiraDetalhes, 'espacosSolicitados' | 'email' | 'senha'>> & {
  espacoPiscina?: boolean;
  espacoQuadra?: boolean;
  espacoSociety?: boolean;
  espacoTenis?: boolean;
  espacoAreia?: boolean;
  espacoAtletismo?: boolean;
  espacosSolicitados?: string;
};

@Component({
  selector: 'app-tela-renovacao-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent],
  templateUrl: './tela-renovacao-formulario.component.html',
  styleUrl: './tela-renovacao-formulario.component.css'
})

export class TelaRenovacaoFormularioComponent implements OnInit {
  dadosRenovacao: DadosRenovacaoForm = {};

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (MOCK_CARTEIRAS.length > 0) {
      const dadosAtuais = MOCK_CARTEIRAS[0];

      this.dadosRenovacao = {
        nome: dadosAtuais.nome,
        matricula: dadosAtuais.matricula,
        curso: dadosAtuais.curso,
        centro: dadosAtuais.centro,
        telefone: dadosAtuais.telefone,
        contatoEmergenciaNome: dadosAtuais.contatoEmergenciaNome,
        contatoEmergenciaTel: dadosAtuais.contatoEmergenciaTel,
      };

      const espacosAtuaisStr = dadosAtuais.espacosSolicitados?.toLowerCase() || '';
      this.dadosRenovacao.espacoPiscina = espacosAtuaisStr.includes('piscina');
      this.dadosRenovacao.espacoQuadra = espacosAtuaisStr.includes('quadra');
      this.dadosRenovacao.espacoSociety = espacosAtuaisStr.includes('campo society');
      this.dadosRenovacao.espacoTenis = espacosAtuaisStr.includes('quadra de tênis');
      this.dadosRenovacao.espacoAreia = espacosAtuaisStr.includes('quadra de areia');
      this.dadosRenovacao.espacoAtletismo = espacosAtuaisStr.includes('pista de atletismo');

      console.log('Dados carregados para formulário de renovação:', this.dadosRenovacao);
    } else {
      console.error("Mock de carteiras não encontrado para TelaRenovacaoFormulario.");
    }
  }

  onSubmitRenovacao(): void {
    const espacosSelecionadosArray: string[] = [];
    if (this.dadosRenovacao.espacoPiscina) espacosSelecionadosArray.push('Piscina');
    if (this.dadosRenovacao.espacoQuadra) espacosSelecionadosArray.push('Quadra');
    if (this.dadosRenovacao.espacoSociety) espacosSelecionadosArray.push('Campo Society');
    if (this.dadosRenovacao.espacoTenis) espacosSelecionadosArray.push('Quadra de Tênis');
    if (this.dadosRenovacao.espacoAreia) espacosSelecionadosArray.push('Quadra de Areia');
    if (this.dadosRenovacao.espacoAtletismo) espacosSelecionadosArray.push('Pista de Atletismo');

    this.dadosRenovacao.espacosSolicitados = espacosSelecionadosArray.join(', ');

    console.log('Formulário de renovação enviado:', this.dadosRenovacao);
    this.router.navigate(['/espera-validacao'], { state: { mensagem: 'Sua solicitação de renovação com dados atualizados foi enviada e está em análise.', origem: 'renovacao_atualizada' } });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Arquivo selecionado para renovação:', file.name);
    }
  }
}