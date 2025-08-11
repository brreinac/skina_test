// src/app/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  counts: any = { users: 0, categories: 0, subcategories: 0, products: 0 };
  recent: any[] = [];
  currentUser: any = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isBasic(): boolean {
    const user = this.currentUser;
    if (!user) return false;
    if (Array.isArray(user.roles)) {
      return user.roles.includes('basico');
    }
    if (typeof user.roles === 'string') {
      return user.roles === 'basico';
    }
    return false;
  }

  async ngOnInit() {
    this.currentUser = this.authService.getUser();

    try {
      const res: any = await firstValueFrom(this.http.get('/api/dashboard/stats', { withCredentials: true }));
      this.counts = res.counts ?? this.counts;
      this.recent = res.recent_products ?? [];
    } catch (err) {
      console.error('Error cargando stats:', err);
    }
  }
}
