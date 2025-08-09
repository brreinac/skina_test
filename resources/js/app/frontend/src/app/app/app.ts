// src/app/app.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Al iniciar la SPA intentamos cargar el usuario actual
  async ngOnInit() {
    try {
      await this.auth.loadUser();
      // usuario cargado y activo -> nada más a hacer
    } catch (err: any) {
      // si el usuario está inactivo o no hay sesión, avisar y dirigir al login
      // Mensajes simples; puedes reemplazar por un toast
      const msg = err?.message ?? 'Por favor inicia sesión';
      if (String(msg).toLowerCase().includes('inactivo')) {
        alert('Tu cuenta está inactiva. Contacta al administrador.');
      }
      // dirigir al login (si no estamos ya)
      if (!location.pathname.startsWith('/login')) {
        this.router.navigate(['/login']);
      }
    }
  }
}
