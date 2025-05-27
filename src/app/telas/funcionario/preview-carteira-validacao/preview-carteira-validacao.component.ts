import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface CarteiraDetalhes {
  id: string;
  nome: string;
  matricula: string;
  curso: string;
  centro: string;
  cpf: string;
  telefone: string;
  email: string;
  contatoEmergenciaNome: string;
  contatoEmergenciaTel: string;
  validade: string;
  espacosSolicitados: string;
  fotoDocumentoUrl?: string;
}

@Component({
  selector: 'app-preview-carteira-validacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-carteira-validacao.component.html',
  styleUrl: './preview-carteira-validacao.component.css'
})
export class PreviewCarteiraValidacaoComponent implements OnInit {
  carteiraId: string | null = null;
  dadosCarteira: CarteiraDetalhes | undefined = undefined;

  abaAtiva: string = 'formulario'; // 'formulario' ou 'previewCarteira'

  private mockCarteiras: CarteiraDetalhes[] = [
    {
      id: '1',
      nome: 'João Eduardo Lima Sousa',
      matricula: '2320222',
      curso: 'Comércio Exterior',
      centro: 'CCG',
      cpf: '111.222.333-44',
      telefone: '85 98999-9999',
      email: 'joao.eduardo&#64;email.com',
      contatoEmergenciaNome: 'Maria Lima',
      contatoEmergenciaTel: '85 98888-8888',
      validade: '31/12/2025',
      espacosSolicitados: 'Piscina, Quadra, Society',
      fotoDocumentoUrl: 'https://via.placeholder.com/350x250.png?text=Doc+ID+1'
    },
    {
      id: '2',
      nome: 'Ciclana da Silva',
      matricula: '2320333',
      curso: 'Engenharia de Software',
      centro: 'CCT',
      cpf: '222.333.444-55',
      telefone: '85 98777-7777',
      email: 'ciclana.silva&#64;email.com',
      contatoEmergenciaNome: 'José Silva',
      contatoEmergenciaTel: '85 98666-6666',
      validade: '30/11/2025',
      espacosSolicitados: 'Quadra de Tênis, Pista de Atletismo',
      fotoDocumentoUrl: 'https://via.placeholder.com/350x250.png?text=Doc+ID+2'
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carteiraId = this.route.snapshot.paramMap.get('id');
    if (this.carteiraId) {
      this.dadosCarteira = this.mockCarteiras.find(c => c.id === this.carteiraId);
    }
    if (!this.dadosCarteira) {
      console.error('Carteira não encontrada com o ID:', this.carteiraId);
    }
  }

  selecionarAba(nomeAba: string): void {
    this.abaAtiva = nomeAba;
  }

  aprovarCarteira(): void {
    console.log(`Carteira ${this.carteiraId} APROVADA`, this.dadosCarteira);
    this.router.navigate(['/funcionario/validacao-resultado'], { state: { status: 'aprovada', id: this.carteiraId, nome: this.dadosCarteira?.nome } });
  }

  rejeitarCarteira(): void {
    console.log(`Carteira ${this.carteiraId} REJEITADA`, this.dadosCarteira);
    this.router.navigate(['/funcionario/validacao-resultado'], { state: { status: 'rejeitada', id: this.carteiraId, nome: this.dadosCarteira?.nome } });
  }
}