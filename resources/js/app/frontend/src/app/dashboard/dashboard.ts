// src/app/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  counts: any = { users: 0, categories: 0, subcategories: 0, products: 0 };
  recent: any[] = [];

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      const res: any = await firstValueFrom(this.http.get('/api/dashboard/stats', { withCredentials: true }));
      this.counts = res.counts ?? this.counts;
      this.recent = res.recent_products ?? [];
    } catch (err) {
      console.error('Error cargando stats:', err);
    }
  }
}
