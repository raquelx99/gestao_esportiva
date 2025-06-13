// src/app/services/horarioService.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { Local } from '../entity/Local';
import { Disponibilidade } from '../entity/Disponibilidade';

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getDisponibilidade(localId: string, dia: number): Observable<Disponibilidade[]> {
    return this.http.get<Disponibilidade[]>(
      `${this.apiUrl}/disponibilidade/${localId}/${dia}`
    );
  }

    // POST: criar uma nova disponibilidade (marcar como disponível)
  criarDisponibilidade(localId: string, diaSemana: number, horarioInicio: string, horarioFinal: string): Observable<Disponibilidade> {
    const body = {
    localId: localId,
    diaDaSemana: diaSemana,
    horarioInicio: horarioInicio,
    horarioFinal: horarioFinal
  };
    console.log('Enviando para a API (criarDisponibilidade):', body);
    return this.http.post<Disponibilidade>(`${this.apiUrl}/disponibilidade`, body);
  }

  // DELETE: remover disponibilidade (marcar indisponível)
  deletarDisponibilidade(disponibilidadeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/disponibilidade/${disponibilidadeId}`);
  }
}