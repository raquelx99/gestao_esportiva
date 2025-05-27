import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // << IMPORTAR AQUI

@Component({
  selector: 'app-validar-carteiras',
  standalone: true, // << ADICIONAR AQUI
  imports: [RouterLink], // << ADICIONAR AQUI
  templateUrl: './validar-carteiras.component.html',
  styleUrl: './validar-carteiras.component.css'
})
export class ValidarCarteirasComponent {

}