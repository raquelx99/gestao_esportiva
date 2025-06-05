import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { Local } from '../entity/Local';

@Injectable({ providedIn: 'root' })
export class LocalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  listarLocais(): Observable<Local[]> {
    return this.http.get<Local[]>(`${this.apiUrl}/api/locais`);
  }
}

