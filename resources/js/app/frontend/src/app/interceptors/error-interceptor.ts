// src/app/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Limpiar estado y redirigir al login
          this.auth.clearUser();
          // Puedes mostrar una notificación si lo deseas
          try { alert('Tu sesión expiró o no tienes permisos. Inicia sesión nuevamente.'); } catch {}
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
