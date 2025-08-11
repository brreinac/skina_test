// src/app/guards/admin-guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // helper para obtener user de forma segura
  const getLocalUser = () => {
    try {
      if (typeof auth.getUser === 'function') return auth.getUser();
      return (auth as any).user ?? null;
    } catch {
      return null;
    }
  };

  const isAdminLocal = (user: any) => {
    try {
      // si existe función isAdmin, usarla
      if (typeof auth.isAdmin === 'function') return auth.isAdmin();
      // si no, inferir por roles del usuario
      if (user && Array.isArray(user.roles)) {
        return user.roles.includes('administrador') || user.roles.includes('admin');
      }
      return false;
    } catch {
      return false;
    }
  };

  // 1) chequear si ya hay user en memoria
  const localUser = getLocalUser();
  if (localUser && Array.isArray(localUser.roles) && localUser.roles.length > 0) {
    return isAdminLocal(localUser)
      ? true
      : router.createUrlTree(['/dashboard']);
  }

  // 2) intentar cargar user desde backend si hay método
  if (typeof auth.loadUser === 'function') {
    // loadUser puede devolver Promise u Observable -> normalizamos a Promise
    const maybePromise = (auth.loadUser() as any);
    const asPromise = (maybePromise && typeof maybePromise.then === 'function')
      ? maybePromise
      : Promise.resolve(maybePromise);

    return asPromise
      .then(() => {
        const userAfter = getLocalUser();
        return isAdminLocal(userAfter) ? true : router.createUrlTree(['/dashboard']);
      })
      .catch(() => {
        // si falla, redirigir a login con redirect
        return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
      });
  }

  // 3) si no hay forma de cargar user -> enviar a login
  return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};
