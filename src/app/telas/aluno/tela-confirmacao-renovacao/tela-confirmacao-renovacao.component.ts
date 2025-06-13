import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../componentes/top-bar/top-bar.component'; // Ajuste o caminho se necessário
import { CarteiraDetalhes } from '../../../core/mocks/mock-carteiras'; // Ajuste o caminho se necessário
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { AuthService } from '../../../services/auth.service';
import { Carteirinha } from '../../../entity/Carteirinha';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tela-confirmacao-renovacao',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './tela-confirmacao-renovacao.component.html',
  styleUrl: './tela-confirmacao-renovacao.component.css'
})
export class TelaConfirmacaoRenovacaoComponent implements OnInit {
  dadosCarteiraAtual: Carteirinha | undefined;
  private apiUrl = 'http://localhost:3000'

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

  async confirmarDadosIguais(): Promise<void> {
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

    if (this.dadosCarteiraAtual.urlFoto) {
      try {

        const fullFotoUrl = this.apiUrl + this.dadosCarteiraAtual.urlFoto;
        
        console.log(`Buscando imagem de: ${fullFotoUrl}`); 

        const response = await fetch(fullFotoUrl);

        if (!response.ok) {
          const errorBody = await response.text(); 
          throw new Error(`Falha ao baixar foto da carteirinha. Status: ${response.status}. Body: ${errorBody}`);
        }

        const blob = await response.blob();

        if (!blob.type.startsWith('image/')) {
          console.error('Tipo de imagem inválido:', blob.type);
          return; 
        }

        formData.append('foto', blob, 'carteirinha.jpg');

      } catch (err) {
        console.error('Erro ao baixar foto para enviar na renovação:', err);
        alert('Não foi possível obter a foto atual. A renovação não pode continuar sem a foto.');
        return; 
      }
    } else {
      console.warn('Carteirinha não tem foto para enviar. Isso pode ser um erro no backend.');
      
      alert('A carteirinha atual não possui uma foto. Não é possível renovar sem uma foto.');
      return; 
    }

    this.carteirinhaService.renovarCarteirinha(this.dadosCarteiraAtual._id!, formData).pipe(
      switchMap(() => {
        return this.authService.refreshUserData(); 
      })
    ).subscribe({
      next: () => {

        console.log('Dados do usuário atualizados. Navegando para a tela de espera.');
        this.router.navigate(['/espera-validacao']);
      },
      error: (err) => {
        console.error('Erro no processo de renovação ou atualização de dados:', err);
        alert('Erro ao enviar solicitação de renovação. Tente novamente mais tarde.');
      }
    });

  }

  dadosMudaram(): void {
    console.log('Aluno indicou que os dados mudaram. Indo para formulário de atualização...');
    this.router.navigate(['/aluno/renovacao-formulario']);
  }
}