import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    console.log('[AuthInterceptor] intercept chamado para URL:', req.url);
    console.log('[AuthInterceptor] token recuperado:', token);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[AuthInterceptor] requisição clonada com Authorization:', cloned.headers.get('Authorization'));
      return next.handle(cloned);
    }
    console.log('[AuthInterceptor] sem token, enviando requisição original');
    return next.handle(req);
  }
}