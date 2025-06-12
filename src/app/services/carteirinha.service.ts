// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable }      from 'rxjs';
import { Carteirinha } from '../entity/Carteirinha';

@Injectable({
  providedIn: 'root'
})
export class CarteirinhaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';  

  constructor() {}

    criarCarteirinha(formData: FormData): Observable<Carteirinha> {
    return this.http.post<Carteirinha>(`${this.apiUrl}/api/carteirinhas`, formData);
    }

    marcarComoLiberado(estudanteId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/api/carteirinhas/liberar/${estudanteId}`, {});
    }

    getCarteirinhaPorId(carteirinhaId: string): Observable<Carteirinha> {
    return this.http.get<Carteirinha>(`${this.apiUrl}/api/carteirinhas/${carteirinhaId}`);
    }

    getCarteirinhaPorEstudante(estudanteId: string): Observable<Carteirinha> {
    return this.http.get<Carteirinha>(`${this.apiUrl}/api/carteirinhas/estudante/${estudanteId}`);
    }

    getCarteirinhaPorMatricula(matricula: string): Observable<Carteirinha> {
    return this.http.get<Carteirinha>(`${this.apiUrl}/api/carteirinhas/matricula/${matricula}`);
    }

    getCarteirinhasPendentes(): Observable<Carteirinha[]> {
    return this.http.get<Carteirinha[]>(`${this.apiUrl}/api/carteirinhas/pendentes`);
    }

    aprovarCarteirinha(carteirinhaId: string): Observable<Carteirinha> {
    return this.http.put<Carteirinha>(
        `${this.apiUrl}/api/carteirinhas/aprovar/${carteirinhaId}`, 
        {}
    );
    }

    rejeitarCarteirinha(carteirinhaId: string): Observable<Carteirinha> {
    return this.http.put<Carteirinha>(
        `${this.apiUrl}/api/carteirinhas/rejeitar/${carteirinhaId}`, 
        {}
    );
    }

}