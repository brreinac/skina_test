// src/app/services/auth.ts
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

  // Obtener csrf cookie para Sanctum
  csrf() {
    return firstValueFrom(this.http.get('/sanctum/csrf-cookie', { withCredentials: true }));
  }

  // Login: solicita CSRF antes y luego llama al endpoint de login
  async login(username: string, password: string) {
    await this.csrf();
    const user = await firstValueFrom(this.http.post<AppUser>(`${this.base}/login`, { username, password }, { withCredentials: true }));
    this.setUser(user);
    return user;
  }

  // Logout: intenta cerrar sesión en backend y limpia estado local
  async logout() {
    try {
      await firstValueFrom(this.http.post(`${this.base}/logout`, {}, { withCredentials: true }));
    } finally {
      this.clearUser();
    }
  }

  // --- Código recomendado: loadUser() mejorado ---
  // Llama a /api/user para obtener el usuario actual. Si is_active === false => fuerza logout.
  async loadUser() {
    try {
      const user = await firstValueFrom(this.http.get<AppUser>(`${this.base}/user`, { withCredentials: true }));
      if (!user) {
        // No hay sesión
        this.clearUser();
        throw new Error('No hay sesión activa');
      }

      // Normalizar roles a array
      if (user.roles && !Array.isArray(user.roles)) {
        try {
          user.roles = JSON.parse(String(user.roles));
        } catch {
          user.roles = [String(user.roles)];
        }
      }

      // Si el backend indica que el usuario está inactivo -> limpiar y lanzar
      if (user.is_active === false) {
        this.clearUser();
        throw new Error('Usuario inactivo');
      }

      // Guardar user y propagar
      this.setUser(user);
      return user;
    } catch (err) {
      // En cualquier error (401, 403, red de backend), limpiamos el estado local
      this.clearUser();
      throw err;
    }
  }

  // Helpers para manejar estado local
  setUser(user: AppUser | null) {
    if (user) {
      // Asegurar roles como array
      if (user.roles && !Array.isArray(user.roles)) {
        try { user.roles = JSON.parse(String(user.roles)); } catch { user.roles = [String(user.roles)]; }
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
    const u = this.getUser();
    return !!u;
  }

  isAdmin(): boolean {
    const u = this.getUser();
    return !!u && Array.isArray(u.roles) && (u.roles as string[]).includes('administrador');
  }

  isBasic(): boolean {
    const u = this.getUser();
    return !!u && Array.isArray(u.roles) && (u.roles as string[]).includes('basico');
  }
}
