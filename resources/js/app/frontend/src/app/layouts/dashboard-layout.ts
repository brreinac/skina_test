import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Corrige ruta si es diferente

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/dashboard">SkinaTech</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/products">Productos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories">Categorías</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/subcategories">Subcategorías</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <button class="btn btn-outline-light" (click)="logout()">Cerrar sesión</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class DashboardLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  async logout(): Promise<void> {
    try {
      await this.auth.logout();
    } catch {
      // Ignorar errores en logout, igual seguimos
    }
    this.router.navigate(['/login']);
  }
}
