import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * CredentialsInterceptor: añade withCredentials: true a todas las peticiones HTTP
 * para que Sanctum/laravel pueda usar cookies de sesión/XSRF
 */
@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si ya está set withCredentials, no modificar.
    if (req.withCredentials) {
      return next.handle(req);
    }
    const cloned = req.clone({ withCredentials: true });
    return next.handle(cloned);
  }
}
