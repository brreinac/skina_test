// src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';

export type AppUser = {
  id?: number;
  username?: string;
  name?: string;
  email?: string;
  roles?: string[] | string;
  is_active?: boolean;
  [k: string]: any;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api';
  private _user$ = new BehaviorSubject<AppUser | null>(null);
  public user$ = this._user$.asObservable();

  // Promise that resolves when initial loadUser call finishes (or null if never called)
  private _loadedPromise: Promise<AppUser | null> | null = null;

  constructor(private http: HttpClient) {}

  // ---------- AUTH API ----------
  async csrf() {
    return firstValueFrom(this.http.get('/sanctum/csrf-cookie', { withCredentials: true }));
  }

  async login(username: string, password: string) {
    await this.csrf();
    const user = await firstValueFrom(this.http.post<AppUser>(`${this.base}/login`, { username, password }, { withCredentials: true }));
    this.setUser(user);
    return user;
  }

  async logout() {
    try {
      await firstValueFrom(this.http.post(`${this.base}/logout`, {}, { withCredentials: true }));
    } finally {
      this.clearUser();
    }
  }

  // loadUser: obtiene /api/user y normaliza roles; retorna user o lanza.
  loadUser(): Promise<AppUser | null> {
    if (!this._loadedPromise) {
      this._loadedPromise = (async () => {
        try {
          const user = await firstValueFrom(this.http.get<AppUser>(`${this.base}/user`, { withCredentials: true }));
          console.log('Usuario cargado:', user);
          if (!user) {
            this.clearUser();
            return null;
          }

          // normalizar roles
          if (user.roles && !Array.isArray(user.roles)) {
            try { user.roles = JSON.parse(String(user.roles)); } catch { user.roles = [String(user.roles)]; }
          }

          // inactive user -> clear and return null
          if (user.is_active === false) {
            this.clearUser();
            throw new Error('Usuario inactivo');
          }

          this.setUser(user);
          return user;
        } catch (err) {
          console.error('Error al cargar usuario:', err);
          this.clearUser();
          throw err;
        }
      })();
    }
    return this._loadedPromise;
  }

  // ---------- local helpers ----------
  setUser(user: any | null) {
    if (user) {
      if (user.roles && !Array.isArray(user.roles)) {
        try { user.roles = JSON.parse(String(user.roles)); } catch { user.roles = [String(user.roles)]; }
      }
      // si roles no existe, asegurarlo como array vacío
      if (!user.roles) user.roles = [];
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
    this._loadedPromise = null;
  }

  // Síncronos útiles para guards/templates
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
    return !!u && Array.isArray(u.roles) && (u.roles as string[]).includes('administrador');
  }

  // utilidad para forzar recarga inmediata (opcional)
  async refreshUser() {
    this._loadedPromise = null;
    return this.loadUser();
  }
}
