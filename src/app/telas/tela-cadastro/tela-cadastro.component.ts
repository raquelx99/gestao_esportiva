// src/app/telas/tela-cadastro/tela-cadastro.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService }   from '../../services/auth.service';
import { CarteirinhaService } from '../../services/carteirinha.service';

import { EstudanteCreateDTO } from '../../entity/EstudanteCreateDTO';
import { Carteirinha }        from '../../entity/Carteirinha';

@Component({
  selector: 'app-tela-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tela-cadastro.component.html',
  styleUrl: './tela-cadastro.component.css'
})
export class TelaCadastroComponent {
  nome = '';
  matricula = '';
  centro = '';
  curso = '';
  telefone = '';
  senha = '';
  telefoneUrgencia = '';
  espacosSelecionados: string[] = [];

  cursosPorCentro: { [centro: string]: string[] } = {
    CCCG: ['Administração', 'Ciências Contábeis'],
    CCT: ['Engenharia de Computação', 'Engenharia Civil', 'Engenharia Mecânica'],
    CCS: ['Design Gráfico', 'Arquitetura', 'Publicidade'],
    CCD: ['Direito', 'Serviço Social'],
  };

  availableCursos: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private carteirinhaService: CarteirinhaService
  ) {}

  onCentroChange(novoCentro: string) {
    this.availableCursos = this.cursosPorCentro[novoCentro] || [];
    this.curso = '';
  }

  onSubmit() {
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
