import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component';
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras';

// Definição do tipo DadosRenovacaoForm SEM o campo 'senha'
type DadosRenovacaoForm = Partial<Omit<CarteiraDetalhes, 'espacosSolicitados' | 'email' | 'senha' >> & { // Adicionado 'senha' ao Omit
  espacoPiscina?: boolean;
  espacoQuadra?: boolean;
  espacoSociety?: boolean;
  espacoTenis?: boolean;
  espacoAreia?: boolean;
  espacoAtletismo?: boolean;
  espacosSolicitados?: string;
  // novaFotoDocumento?: File; // Se for implementar o upload
};

@Component({
  selector: 'app-tela-renovacao-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent],
  templateUrl: './tela-renovacao-formulario.component.html',
  styleUrl: './tela-renovacao-formulario.component.css' // Usaremos o CSS do cadastro
})
export class TelaRenovacaoFormularioComponent implements OnInit {
  // A propriedade 'senha' não precisa ser inicializada aqui se não existe no tipo
  dadosRenovacao: DadosRenovacaoForm = {};

  // nomeArquivoSelecionado: string | null = null;

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
        // Propriedade 'senha' REMOVIDA daqui

        espacoPiscina: dadosAtuais.espacosSolicitados?.toLowerCase().includes('piscina'),
        espacoQuadra: dadosAtuais.espacosSolicitados?.toLowerCase().includes('quadra'),
        espacoSociety: dadosAtuais.espacosSolicitados?.toLowerCase().includes('campo society'),
        espacoTenis: dadosAtuais.espacosSolicitados?.toLowerCase().includes('quadra de tênis'),
        espacoAreia: dadosAtuais.espacosSolicitados?.toLowerCase().includes('quadra de areia'),
        espacoAtletismo: dadosAtuais.espacosSolicitados?.toLowerCase().includes('pista de atletismo'),
      };
      console.log('Dados carregados para formulário de renovação (sem senha):', this.dadosRenovacao);
    } else {
      console.error("Mock de carteiras não encontrado para TelaRenovacaoFormulario.");
    }
  }

  onSubmitRenovacao(): void {
    // ... (lógica de reconstruir espacosSolicitados permanece a mesma) ...
    const espacosSelecionadosArray: string[] = [];
    if (this.dadosRenovacao.espacoPiscina) espacosSelecionadosArray.push('Piscina');
    if (this.dadosRenovacao.espacoQuadra) espacosSelecionadosArray.push('Quadra');
    if (this.dadosRenovacao.espacoSociety) espacosSelecionadosArray.push('Campo Society');
    if (this.dadosRenovacao.espacoTenis) espacosSelecionadosArray.push('Quadra de Tênis');
    if (this.dadosRenovacao.espacoAreia) espacosSelecionadosArray.push('Quadra de Areia');
    if (this.dadosRenovacao.espacoAtletismo) espacosSelecionadosArray.push('Pista de Atletismo');
    this.dadosRenovacao.espacosSolicitados = espacosSelecionadosArray.join(', ');

    // A propriedade 'senha' não fará mais parte de this.dadosRenovacao aqui
    console.log('Formulário de renovação enviado (sem senha):', this.dadosRenovacao);
    this.router.navigate(['/espera-validacao'], { state: { mensagem: 'Sua solicitação de renovação com dados atualizados foi enviada e está em análise.', origem: 'renovacao_atualizada' } });
  }

  // O método onFileSelected pode continuar existindo se você ainda tem o input de arquivo no HTML
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Arquivo selecionado para renovação:', file.name);
      // this.nomeArquivoSelecionado = file.name;
      // this.dadosRenovacao.novaFotoDocumento = file;
    }
  }
}