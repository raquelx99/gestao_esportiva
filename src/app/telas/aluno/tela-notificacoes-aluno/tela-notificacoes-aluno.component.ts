import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor
import { TopBarComponent } from "../../../componentes/top-bar/top-bar.component"; // Ajuste o caminho se necessário

// Interface para uma Notificação
interface Notificacao {
  id: number;
  tipo: 'aviso' | 'sucesso' | 'erro' | 'info'; // Para estilização e ícones futuros
  mensagem: string;
  data: string; // Ex: "27/05/2025 10:30"
  lida: boolean;
}

@Component({
  selector: 'app-tela-notificacoes-aluno',
  standalone: true,
  imports: [CommonModule, TopBarComponent], // Adicionar TopBarComponent e CommonModule
  templateUrl: './tela-notificacoes-aluno.component.html',
  styleUrl: './tela-notificacoes-aluno.component.css'
})
export class TelaNotificacoesAlunoComponent implements OnInit {
  listaDeNotificacoes: Notificacao[] = [];

  private mockNotificacoes: Notificacao[] = [
    {
      id: 1,
      tipo: 'aviso',
      mensagem: 'Sua carteirinha vencerá em 10 dias. Não se esqueça de renovar!',
      data: '25/05/2025 09:00',
      lida: false
    },
    {
      id: 2,
      tipo: 'sucesso',
      mensagem: 'Sua solicitação de carteirinha foi APROVADA! Bem-vindo(a)!',
      data: '20/05/2025 14:30',
      lida: false
    },
    {
      id: 3,
      tipo: 'erro',
      mensagem: 'Sua solicitação de carteirinha foi REJEITADA. Verifique os motivos.',
      data: '18/05/2025 11:00',
      lida: true
    },
    {
      id: 4,
      tipo: 'info',
      mensagem: 'Novo horário de funcionamento da piscina: Segunda a Sexta, das 08h às 18h.',
      data: '15/05/2025 17:00',
      lida: false
    },
    {
      id: 5,
      tipo: 'aviso',
      mensagem: 'Manutenção programada para a Quadra A na próxima quarta-feira.',
      data: '10/05/2025 08:00',
      lida: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.listaDeNotificacoes = this.mockNotificacoes;
    console.log('Notificações carregadas:', this.listaDeNotificacoes);
  }

  // Futuramente, métodos para marcar como lida, deletar, etc.
  marcarComoLida(notificacao: Notificacao): void {
    notificacao.lida = true;
    console.log('Notificação marcada como lida:', notificacao);
    // Aqui você chamaria um serviço para atualizar o status no backend
  }
}