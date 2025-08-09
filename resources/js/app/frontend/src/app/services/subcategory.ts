import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubcategoryService {
  private base = '/api/subcategories';

  constructor(private http: HttpClient) {}

  list() {
    return firstValueFrom(this.http.get(this.base, { withCredentials: true }));
  }

  get(id: number) {
    return firstValueFrom(this.http.get(`${this.base}/${id}`, { withCredentials: true }));
  }

  store(data: any) {
    return firstValueFrom(this.http.post(this.base, data, { withCredentials: true }));
  }

  update(id: number, data: any) {
    return firstValueFrom(this.http.put(`${this.base}/${id}`, data, { withCredentials: true }));
  }

  delete(id: number) {
    return firstValueFrom(this.http.delete(`${this.base}/${id}`, { withCredentials: true }));
  }
}
