import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  list() {
    return firstValueFrom(this.http.get('/api/categories'));
  }

  get(id: number) {
    return firstValueFrom(this.http.get(`/api/categories/${id}`));
  }

  store(data: any) {
    return firstValueFrom(this.http.post('/api/categories', data));
  }

  update(id: number, data: any) {
    return firstValueFrom(this.http.put(`/api/categories/${id}`, data));
  }

  delete(id: number) {
    return firstValueFrom(this.http.delete(`/api/categories/${id}`));
  }
}
