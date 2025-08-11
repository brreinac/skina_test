// src/app/services/subcategory.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubcategoryService {
  private base = '/api/subcategories';

  constructor(private http: HttpClient) {}

  list() {
    return firstValueFrom(this.http.get<any[]>(this.base, { withCredentials: true }));
  }

  get(id: number | string) {
    return firstValueFrom(this.http.get<any>(`${this.base}/${id}`, { withCredentials: true }));
  }

  store(payload: any) {
    return firstValueFrom(this.http.post<any>(this.base, payload, { withCredentials: true }));
  }

  update(id: number | string, payload: any) {
    return firstValueFrom(this.http.put<any>(`${this.base}/${id}`, payload, { withCredentials: true }));
  }

  delete(id: number | string) {
    return firstValueFrom(this.http.delete<any>(`${this.base}/${id}`, { withCredentials: true }));
  }
}
