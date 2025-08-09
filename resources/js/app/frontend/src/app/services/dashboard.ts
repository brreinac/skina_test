// src/app/services/dashboard.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type DashboardStats = {
  counts: { users: number; categories: number; subcategories: number; products: number; };
  recent_products: any[];
  generated_at: string;
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = '/api';
  constructor(private http: HttpClient) {}

  async stats(): Promise<DashboardStats> {
    return firstValueFrom(this.http.get<DashboardStats>(`${this.base}/dashboard/stats`, { withCredentials: true }));
  }
}
