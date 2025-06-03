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

    criarCarteirinha(estudanteId: string, espacos: string[]): Observable<Carteirinha> {
    const payload = { estudanteId, espacos };
    return this.http.post<Carteirinha>(
        `${this.apiUrl}/api/carteirinhas`, 
        payload
    );
    }

    marcarComoLiberado(estudanteId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/api/carteirinhas/liberar/${estudanteId}`, {});
    }

    getCarteirinhaPorEstudante(estudanteId: string): Observable<Carteirinha> {
    return this.http.get<Carteirinha>(`${this.apiUrl}/carteirinhas/estudante/${estudanteId}`);
    }      

}