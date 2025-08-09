// src/app/dashboard/dashboard.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../services/dashboard';
import { AuthService } from '../services/auth';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  private dashboardService = inject(DashboardService);
  public auth = inject(AuthService);

  public loading = true;
  public stats: any = { counts: { users:0, categories:0, subcategories:0, products:0 }, recent_products: [] };
  public error: string | null = null;

  constructor() {
    this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;
    try {
      this.stats = await this.dashboardService.stats();
    } catch (err:any) {
      console.error(err);
      this.error = err?.message || 'Error al cargar datos';
    } finally {
      this.loading = false;
    }
  }

  isAdmin() { return this.auth.isAdmin(); }
  isLogged() { return this.auth.isLoggedIn(); }
}
