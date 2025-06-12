import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarteirinhaService } from '../../services/carteirinha.service';

import { EstudanteCreateDTO } from '../../entity/EstudanteCreateDTO';
import { Carteirinha } from '../../entity/Carteirinha';

@Component({
  selector: 'app-tela-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tela-cadastro.component.html',
  styleUrls: ['./tela-cadastro.component.css']
})
export class TelaCadastroComponent implements OnInit {
  nome = '';
  matricula = '';
  centro = '';
  curso = '';
  telefone = '';
  senha = '';
  telefoneUrgencia = '';
  espacosSelecionados: string[] = [];

  selectedFile: File | null = null;
  selectedFileName: string = '';

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
    'CCD': [
      'Direito'
    ]
  };

  centros: string[] = [];
  availableCursos: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private carteirinhaService: CarteirinhaService
  ) {}

  ngOnInit(): void {
    this.centros = Object.keys(this.cursosPorCentro);
  }

  onCentroChange(novoCentro: string) {
    this.availableCursos = this.cursosPorCentro[novoCentro] || [];
    this.curso = '';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files && event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }

  atualizarEspacos(event: any) {
    const valor = event.target.value;
    if (event.target.checked) {
      this.espacosSelecionados.push(valor);
    } else {
      this.espacosSelecionados = this.espacosSelecionados.filter(e => e !== valor);
    }
  }

  onSubmit() {
    // 1) Cadastrar estudante primeiro
    const estudantePayload: EstudanteCreateDTO = {
      nome: this.nome,
      senha: this.senha,
      matricula: this.matricula,
      role: 'estudante',
      curso: this.curso,
      centro: this.centro,
      telefone: this.telefone,
      telefoneUrgencia: this.telefoneUrgencia,
    };

    this.authService.cadastrarEstudante(estudantePayload).subscribe({
      next: (res) => {
        // Supondo que res.perfil.dados._id contenha o ID do estudante criado
        const novoEstudante = res.perfil.dados as { _id: string };
        const estudanteId = novoEstudante._id;

        // 2) Agora criar a carteirinha, com FormData incluindo arquivo
        if (!this.selectedFile) {
          console.error('Erro: foto não selecionada');
          // Você pode mostrar mensagem ao usuário aqui e não prosseguir
          return;
        }

        // Monta FormData
        const formData = new FormData();
        formData.append('estudanteId', estudanteId);
        // append de cada espaco. No backend, se o parser aceitar múltiplos campos 'espacos', isso vira array.
        this.espacosSelecionados.forEach(e => formData.append('espacos', e));
        // Se quiser incluir periodoEmSemestres:
        // formData.append('periodoEmSemestres', '1');
        formData.append('foto', this.selectedFile, this.selectedFile.name);

        this.carteirinhaService.criarCarteirinha(formData).subscribe({
          next: (novaCarteirinha: Carteirinha) => {
            console.log('Carteirinha criada:', novaCarteirinha);
            this.router.navigate(['/espera-validacao']);
          },
          error: (errCarteira) => {
            console.error('Erro ao criar carteirinha:', errCarteira);
            this.router.navigate(['/espera-validacao']);
          }
        });
      },
      error: (errEstudo) => {
        console.error('Erro ao cadastrar estudante:', errEstudo);
      }
    });
  }
}
