import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilidade } from '../entity/Disponibilidade';

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDisponibilidade(localId: string, dia: number): Observable<Disponibilidade[]> {
    return this.http.get<Disponibilidade[]>(`${this.apiUrl}/disponibilidade/${localId}/${dia}`);
  }

  criarDisponibilidade(localId: string, diaDaSemana: number, horarioInicio: string, horarioFinal: string): Observable<Disponibilidade> {
    const body = { localId, diaDaSemana, horarioInicio, horarioFinal };
    console.log('Enviando para a API (criarDisponibilidade):', body);
    return this.http.post<Disponibilidade>(`${this.apiUrl}/disponibilidade`, body);
  }

  deletarDisponibilidade(disponibilidadeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/disponibilidade/${disponibilidadeId}`, { observe: 'response' });
  }
}