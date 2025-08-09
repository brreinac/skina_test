import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api';
  constructor(private http: HttpClient) {}

  csrf() {
    return firstValueFrom(this.http.get('/sanctum/csrf-cookie', { withCredentials: true }));
  }

  async login(username: string, password: string) {
    await this.csrf();
    return firstValueFrom(this.http.post(`${this.base}/login`, { username, password }, { withCredentials: true }));
  }

  logout() {
    return firstValueFrom(this.http.post(`${this.base}/logout`, {}, { withCredentials: true }));
  }

  user() {
    return firstValueFrom(this.http.get(`${this.base}/user`, { withCredentials: true }));
  }
}
