// src/app/services/horarioService.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { Local } from '../entity/Local';

export interface Disponibilidade {
  local: Local;
  diaDaSemana: number;
  horarioInicio: string;
  horarioFinal: string;   
  estaDisponivel: boolean;
}

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getDisponibilidade(localId: string, dia: number): Observable<Disponibilidade[]> {
    return this.http.get<Disponibilidade[]>(
      `${this.apiUrl}/api/disponibilidade/${localId}/${dia}`
    );
  }
}