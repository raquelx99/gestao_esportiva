// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable }      from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';  

  constructor() {}

  login(matricula: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth`, { matricula, senha });
  }
  
}