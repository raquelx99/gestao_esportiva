import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component';
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { AuthService } from '../../../services/auth.service';
// Adicione as entidades que você precisa
import { Carteirinha } from '../../../entity/Carteirinha';

// Mantenha o tipo que já tínhamos para os dados do formulário
type DadosRenovacaoForm = {
  id?: string;
  nome?: string;
  matricula?: string;
  curso?: string;
  centro?: string;
  telefone?: string;
  telefoneUrgencia?: string;
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
  selectedFile: File | null = null;
  selectedFileName: string = '';

  // === INÍCIO DAS ADIÇÕES PARA DROPDOWNS DINÂMICOS ===
  cursosPorCentro: { [centro: string]: string[] } = {
    'CCS': [
      'Biomedicina', 'Educação Física', 'Enfermagem', 'Estética e Cosmética',
      'Farmácia', 'Fisioterapia', 'Fonoaudiologia', 'Medicina Veterinária',
      'Nutrição', 'Odontologia', 'Psicologia', 'Terapia Ocupacional'
    ],
    'CCT': [
      'Análise e Desenvolvimento de Sistemas', 'Arquitetura e Urbanismo', 'Ciência da Computação',
      'Engenharia Civil', 'Engenharia Elétrica', 'Engenharia Mecânica',
      'Engenharia da Computação', 'Engenharia de Produção'
    ],
    'CCCG': [
      'Administração', 'Cinema e Audiovisual', 'Ciências Contábeis', 'Ciências Econômicas',
      'Comércio Exterior', 'Design', 'Design de Interiores', 'Design de Moda',
      'Finanças', 'Jornalismo', 'Marketing', 'Moda', 'Negócios', 'Publicidade e Propaganda'
    ],
    'CCD': [ 'Direito' ]
  };

  centros: string[] = [];
  availableCursos: string[] = [];
  // === FIM DAS ADIÇÕES PARA DROPDOWNS DINÂMICOS ===

  constructor(
    private router: Router,
    private authService: AuthService,
    private carteirinhaService: CarteirinhaService
  ) {}

  ngOnInit(): void {
    // Popula a lista de centros a partir das chaves do objeto
    this.centros = Object.keys(this.cursosPorCentro);

    const usuarioLogado = this.authService.usuarioLogado;
    if (!usuarioLogado || !usuarioLogado.usuario.matricula) {
      console.error("Usuário não está logado ou matrícula indisponível.");
      return;
    }
    const matricula = usuarioLogado.usuario.matricula;

    this.carteirinhaService.getCarteirinhaPorMatricula(matricula).subscribe({
      next: (carteirinha) => {
        this.dadosRenovacao = {
          id: carteirinha._id,
          nome: carteirinha.estudante.user.nome,
          matricula: carteirinha.estudante.user.matricula,
          curso: carteirinha.estudante.curso,
          centro: carteirinha.estudante.centro,
          telefone: carteirinha.estudante.telefone,
          telefoneUrgencia: carteirinha.estudante.telefoneUrgencia,
        };
        
        // Após carregar os dados, aciona a lógica de cursos disponíveis pela primeira vez
        this.onCentroChange(this.dadosRenovacao.centro!);
        
        const espacosAtuaisStr = (carteirinha.espacos || []).join(', ').toLowerCase();
        // ... (sua lógica de checkboxes como antes) ...
        this.dadosRenovacao.espacoPiscina = espacosAtuaisStr.includes('piscina');
        this.dadosRenovacao.espacoQuadra = espacosAtuaisStr.includes('quadra');
        this.dadosRenovacao.espacoSociety = espacosAtuaisStr.includes('campo society');
        this.dadosRenovacao.espacoTenis = espacosAtuaisStr.includes('quadra de tênis');
        this.dadosRenovacao.espacoAreia = espacosAtuaisStr.includes('quadra de areia');
        this.dadosRenovacao.espacoAtletismo = espacosAtuaisStr.includes('pista de atletismo');
      },
      error: (err) => console.error('Erro ao buscar dados para renovação:', err)
    });
  }
  
  // NOVO MÉTODO (copiado da tela de cadastro)
  onCentroChange(novoCentro: string) {
    this.availableCursos = this.cursosPorCentro[novoCentro] || [];
    // Não reseta o curso aqui, para manter o valor que veio do banco.
    // Se o usuário MUDAR o centro, o HTML já vai chamar este método e o curso antigo
    // não será mais uma opção válida, forçando-o a re-selecionar.
    // Se quiser resetar o curso toda vez que o centro muda, adicione: this.dadosRenovacao.curso = '';
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

    if (!this.selectedFile) {
      console.error('Erro: nenhuma nova foto foi selecionada.');
      return;
    }

    console.log('Dados da renovação:', this.dadosRenovacao);
    console.log('matricula:', this.dadosRenovacao.matricula!);

    this.authService.getEstudantePorMatricula(this.dadosRenovacao.matricula!).subscribe({
      next: (estudante) => {
        const estudanteId = estudante._id;

        const formData = new FormData();
        formData.append('estudanteId', estudanteId);
        espacosSelecionadosArray.forEach(e => formData.append('espacos', e));
        formData.append('foto', this.selectedFile!, this.selectedFile!.name);

        this.carteirinhaService.renovarCarteirinha(this.dadosRenovacao.id!, formData).subscribe({
          next: (novaCarteirinha) => {
            console.log('Renovação enviada:', novaCarteirinha);
            this.router.navigate(['/espera-validacao'], {
              state: {
                mensagem: 'Sua solicitação de renovação com dados atualizados foi enviada e está em análise.',
                origem: 'renovacao_atualizada'
              }
            });
          },
          error: (err) => {
            console.error('Erro ao enviar renovação:', err);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao buscar estudante pela matrícula:', err);
      }
    });
  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      console.log('Arquivo selecionado para renovação:', file.name);
    }
  }
}