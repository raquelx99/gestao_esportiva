import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { TopBarComponent }   from '../../componentes/top-bar/top-bar.component';

type Status = 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-tela-espera-validacao',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './tela-espera-validacao.component.html',
  styleUrls:   ['./tela-espera-validacao.component.css']
})
export class TelaEsperaValidacaoComponent implements OnInit {
  status: Status = 'pending';

  constructor(private router: Router) {}

  ngOnInit() {
    // buscar status de banco de dados…
  }

  onAdvance() {
    this.router.navigate(['/horarios']);
  }

  onRetry() {
    this.router.navigate(['/cadastro']);
  }
}