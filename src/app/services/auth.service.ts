// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap }      from 'rxjs';
import { EstudanteCreateDTO } from '../entity/EstudanteCreateDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';  
  public usuarioLogado: any = null;

  constructor() {}

  login(matricula: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth`, { matricula, senha })
      .pipe(
        tap(res => {
          this.usuarioLogado = res;
        })
      );
  }

  cadastrarEstudante(dados: EstudanteCreateDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/usuarios`, dados);
  }

  logout() {
    this.usuarioLogado = null;
  }

  get estudanteId(): string | null {
    return this.usuarioLogado?.perfil?.dados?._id || null;
  }

  get statusCarteirinha(): string | null {
    return this.usuarioLogado?.carteirinha?.status || null;
  }

  get liberado(): boolean {
    return this.usuarioLogado?.carteirinha?.liberadoPosValidacao || false;
  }
  
}