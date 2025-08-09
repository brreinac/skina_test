// resources/js/app/frontend/src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';

export type AppUser = {
  id?: number;
  username?: string;
  roles?: string[] | string;
  is_active?: boolean;
  [k: string]: any;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api';
  private _user$ = new BehaviorSubject<AppUser | null>(null);
  public user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {}

  // --- Obtener csrf cookie para Sanctum ---
  csrf() {
    return firstValueFrom(
      this.http.get('/sanctum/csrf-cookie', { withCredentials: true })
    );
  }

  // --- Login ---
  async login(username: string, password: string) {
    await this.csrf();
    const user = await firstValueFrom(
      this.http.post<AppUser>(
        `${this.base}/login`,
        { username, password },
        { withCredentials: true }
      )
    );
    this.setUser(user);
    return user;
  }

  // --- Logout ---
  async logout() {
    try {
      await firstValueFrom(
        this.http.post(`${this.base}/logout`, {}, { withCredentials: true })
      );
    } finally {
      this.clearUser();
    }
  }

  // --- Cargar usuario actual ---
  async loadUser() {
    try {
      const user = await firstValueFrom(
        this.http.get<AppUser>(`${this.base}/user`, { withCredentials: true })
      );
      if (!user) {
        this.clearUser();
        throw new Error('No hay sesión activa');
      }

      if (user.roles && !Array.isArray(user.roles)) {
        try {
          user.roles = JSON.parse(String(user.roles));
        } catch {
          user.roles = [String(user.roles)];
        }
      }

      if (user.is_active === false) {
        this.clearUser();
        throw new Error('Usuario inactivo');
      }

      this.setUser(user);
      return user;
    } catch (err) {
      this.clearUser();
      throw err;
    }
  }

  // --- Helpers ---
  setUser(user: AppUser | null) {
    if (user) {
      if (user.roles && !Array.isArray(user.roles)) {
        try {
          user.roles = JSON.parse(String(user.roles));
        } catch {
          user.roles = [String(user.roles)];
        }
      }
      localStorage.setItem('user', JSON.stringify(user));
      this._user$.next(user);
    } else {
      localStorage.removeItem('user');
      this._user$.next(null);
    }
  }

  clearUser() {
    localStorage.removeItem('user');
    this._user$.next(null);
  }

  getUser(): AppUser | null {
    const raw = localStorage.getItem('user');
    if (raw) return JSON.parse(raw);
    return this._user$.getValue();
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  isAdmin(): boolean {
    const u = this.getUser();
    return (
      !!u &&
      Array.isArray(u.roles) &&
      (u.roles as string[]).includes('administrador')
    );
  }

  isBasic(): boolean {
    const u = this.getUser();
    return (
      !!u &&
      Array.isArray(u.roles) &&
      (u.roles as string[]).includes('basico')
    );
  }
}
