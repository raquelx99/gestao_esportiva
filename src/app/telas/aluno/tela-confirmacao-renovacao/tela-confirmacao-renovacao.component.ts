import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component'; // Ajuste o caminho se necessário
import { CarteiraDetalhes } from '../../../core/mocks/mock-carteiras'; // Ajuste o caminho se necessário
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { AuthService } from '../../../services/auth.service';
import { Carteirinha } from '../../../entity/Carteirinha';

@Component({
  selector: 'app-tela-confirmacao-renovacao',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './tela-confirmacao-renovacao.component.html',
  styleUrl: './tela-confirmacao-renovacao.component.css'
})
export class TelaConfirmacaoRenovacaoComponent implements OnInit {
  dadosCarteiraAtual: Carteirinha | undefined;

  constructor(
    private router: Router,
    private carteirinhaService: CarteirinhaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuarioLogado = this.authService.usuarioLogado;

    if (!usuarioLogado || !usuarioLogado.usuario?.matricula) {
      console.error('Usuário não está logado ou matrícula indisponível.');
      return;
    }

    const matricula = usuarioLogado.usuario.matricula;

    this.carteirinhaService.getCarteirinhaPorMatricula(matricula).subscribe({
      next: (carteira) => {
        this.dadosCarteiraAtual = carteira;
        console.log('Dados da carteira atual carregados para confirmação:', this.dadosCarteiraAtual);
      },
      error: (err) => {
        console.error('Erro ao buscar carteirinha para confirmação de renovação:', err);
      }
    });
  }

  confirmarDadosIguais(): void {
  if (!this.dadosCarteiraAtual || !this.dadosCarteiraAtual._id) {
    console.error('Dados da carteirinha não disponíveis para renovação.');
    return;
  }

  const formData = new FormData();
    formData.append('nome', this.dadosCarteiraAtual.estudante.user.nome);
    formData.append('matricula', this.dadosCarteiraAtual.estudante.user.matricula);
    formData.append('curso', this.dadosCarteiraAtual.estudante.curso);
    formData.append('centro', this.dadosCarteiraAtual.estudante.centro);
    formData.append('telefone', this.dadosCarteiraAtual.estudante.telefone);
    formData.append('telefoneUrgencia', this.dadosCarteiraAtual.estudante.telefoneUrgencia);

    if (Array.isArray(this.dadosCarteiraAtual.espacos)) {
      this.dadosCarteiraAtual.espacos.forEach(espaco => {
        formData.append('espacos[]', espaco);
      });
    } else if (typeof this.dadosCarteiraAtual.espacos === 'string') {
      formData.append('espacos', this.dadosCarteiraAtual.espacos);
    }

    this.carteirinhaService.renovarCarteirinha(this.dadosCarteiraAtual._id!, formData).subscribe({
      next: () => {
        console.log('Renovação enviada com sucesso.');
        this.router.navigate(['/espera-validacao'], {
          state: {
            mensagem: 'Sua solicitação de renovação foi enviada e está em análise.',
            origem: 'renovacao'
          }
        });
      },
      error: (err) => {
        console.error('Erro ao enviar renovação:', err);
        alert('Erro ao enviar solicitação de renovação. Tente novamente mais tarde.');
      }
    });
  }

  dadosMudaram(): void {
    console.log('Aluno indicou que os dados mudaram. Indo para formulário de atualização...');
    this.router.navigate(['/aluno/renovacao-formulario']);
  }
}