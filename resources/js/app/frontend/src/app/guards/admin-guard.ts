import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * adminGuard: permite acceso solo a usuarios con rol 'administrador'
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // si no hay user o no es admin -> redirigir al home (o login)
  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { redirect: state.url } });
    return false;
  }

  if (auth.isAdmin()) {
    return true;
  }

  // puedes mostrar una pagina "no autorizado" o redirigir al dashboard
  router.navigate(['/']);
  return false;
};
