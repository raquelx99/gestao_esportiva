import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarteiraDetalhes, MOCK_CARTEIRAS } from '../../../core/mocks/mock-carteiras';
import { CarteirinhaService } from '../../../services/carteirinha.service';
import { Carteirinha } from '../../../entity/Carteirinha';

@Component({
  selector: 'app-validar-carteiras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './validar-carteiras.component.html',
  styleUrl: './validar-carteiras.component.css'
})
export class ValidarCarteirasComponent implements OnInit {
  listaDeCarteiras: Carteirinha[] = [];

  constructor(
    private carteirinhaService: CarteirinhaService,
  ) { }

  ngOnInit(): void {
    this.carteirinhaService.getCarteirinhasPendentes().subscribe((carteiras: Carteirinha[]) => {
      this.listaDeCarteiras = carteiras;
      console.log('Carteiras para validar carregadas:', this.listaDeCarteiras);
    });
  }
}