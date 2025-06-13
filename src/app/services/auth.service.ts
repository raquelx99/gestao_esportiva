// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap }      from 'rxjs';
import { EstudanteCreateDTO } from '../entity/EstudanteCreateDTO';
import { CarteirinhaService } from './carteirinha.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';  
  public usuarioLogado: any = null;

  constructor(
    private carteirinhaService: CarteirinhaService
  ) {}

  login(matricula: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth`, { matricula, senha })
      .pipe(
        tap(res => {
          this.usuarioLogado = res;
          localStorage.setItem('usuario', JSON.stringify(res));
          console.log(localStorage.getItem('usuario'));;
        })
      );
  }

  refreshUserData(): Observable<any> {
    const matricula = this.usuarioLogado?.usuario?.matricula;

    if (!matricula) {
      console.warn('RefreshUserData chamado, mas nenhum usuário está logado.');
      return of(null);
    }

    return this.carteirinhaService.getCarteirinhaPorMatricula(matricula).pipe(
      tap(carteirinhaAtualizada => {
        console.log('Dados da carteirinha atualizados recebidos:', carteirinhaAtualizada);
        
        this.usuarioLogado.carteirinha = carteirinhaAtualizada;

        localStorage.setItem('usuario', JSON.stringify(this.usuarioLogado));

        console.log('AuthService e localStorage atualizados com sucesso.');
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

  getEstudantePorMatricula(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/estudantes/matricula/${matricula}`) 
  }

  getToken(): string | null {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const parsedUsuario = JSON.parse(usuario);
      return parsedUsuario?.token || null;
    }
    return null;
  }

}