// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  nome: string;
  matricula: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  loginDummy(username: string, password: string): void {
    const user: User = {
      nome: 'João Eduardo Lima Sousa',
      matricula: '2320222'
    };
    this.userSubject.next(user);
  }

  logout(): void {
    this.userSubject.next(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }
}
