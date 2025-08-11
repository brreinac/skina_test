// src/app/auth/auth-guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    // Esperar que la carga inicial del usuario termine (evita redirecciones prematuras)
    await auth.loadUser();
  } catch (err) {
    router.navigate(['/login'], { queryParams: { redirect: state.url } });
    return false;
  }

  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { redirect: state.url } });
    return false;
  }

  return true;
};
