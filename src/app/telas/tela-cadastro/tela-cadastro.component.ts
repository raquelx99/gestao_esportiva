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
  styleUrl: './tela-cadastro.component.css'
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

  // Objeto completo com a relação entre Centros e Cursos
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

  // Listas para popular os dropdowns
  centros: string[] = [];
  availableCursos: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private carteirinhaService: CarteirinhaService
  ) {}

  ngOnInit(): void {
    // Popula a lista de centros a partir das chaves do objeto cursosPorCentro
    this.centros = Object.keys(this.cursosPorCentro);
  }

  onCentroChange(novoCentro: string) {
    this.availableCursos = this.cursosPorCentro[novoCentro] || [];
    this.curso = ''; // Reseta a seleção de curso para evitar inconsistências
  }

  onSubmit() {
    // Seu método onSubmit existente permanece o mesmo
    const estudantePayload: EstudanteCreateDTO = {
      nome: this.nome,
      senha: this.senha,
      role: 'estudante',
      matricula: this.matricula,
      curso: this.curso,
      centro: this.centro,
      telefone: this.telefone,
      telefoneUrgencia: this.telefoneUrgencia
    };

    this.authService.cadastrarEstudante(estudantePayload).subscribe({
      next: (res) => {
        const novoEstudante = res.perfil.dados as { _id: string };
        const estudanteId = novoEstudante._id;
        this.carteirinhaService
          .criarCarteirinha(estudanteId, this.espacosSelecionados)
          .subscribe({
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

  atualizarEspacos(event: any) {
    const valor = event.target.value;
    if (event.target.checked) {
      this.espacosSelecionados.push(valor);
    } else {
      this.espacosSelecionados = this.espacosSelecionados.filter(e => e !== valor);
    }
  }
}