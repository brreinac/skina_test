import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../shared/toast';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class UserFormComponent implements OnInit {
  userId: string | null = null;
  user: any = {};
  saving = false;
  loading = false;
  isProfileMode = false;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.isProfileMode = this.router.url === '/profile';

    if (this.isProfileMode) {
      const currentUser = this.authService.getUser();
      if (!currentUser) {
        this.toast.error('No hay usuario autenticado.');
        this.router.navigate(['/login']);
        return;
      }
      this.userId = currentUser.id?.toString() || null;
      this.user = { ...currentUser };
      delete this.user.password;
    } else {
      this.userId = this.route.snapshot.paramMap.get('id');
      if (this.userId) {
        this.loadUser(this.userId);
      }
    }
  }

  loadUser(id: string) {
    this.loading = true;
    this.http.get<any>(`/api/users/${id}`, { withCredentials: true }).subscribe({
      next: (user) => {
        this.user = user;
        delete this.user.password;
      },
      error: (err) => {
        console.error('Error cargando usuario', err);
        this.toast.error('No se pudo cargar el usuario.');
        this.router.navigate(['/users']);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  save() {
    if (!this.user.username?.trim()) {
      this.toast.warning('El usuario es obligatorio.');
      return;
    }

    this.saving = true;
    const payload = { ...this.user };

    if (this.isProfileMode) {
      delete payload.role;
      delete payload.is_active;

      this.http.put(`/api/profile`, payload, { withCredentials: true }).subscribe({
        next: () => {
          this.toast.success('Perfil actualizado correctamente.');
          this.authService.setUser(payload);
          this.saving = false;
        },
        error: (err) => {
          console.error('Error actualizando perfil', err);
          this.toast.error('Error al actualizar perfil.');
          this.saving = false;
        }
      });
    } else {
      if (this.userId) {
        this.http.put(`/api/users/${this.userId}`, payload, { withCredentials: true }).subscribe({
          next: () => {
            this.toast.success('Usuario actualizado correctamente.');
            this.router.navigate(['/users']);
            this.saving = false;
          },
          error: (err) => {
            console.error('Error actualizando usuario', err);
            this.toast.error('Error al actualizar usuario.');
            this.saving = false;
          }
        });
      } else {
        this.http.post(`/api/users`, payload, { withCredentials: true }).subscribe({
          next: () => {
            this.toast.success('Usuario creado correctamente.');
            this.router.navigate(['/users']);
            this.saving = false;
          },
          error: (err) => {
            console.error('Error creando usuario', err);
            this.toast.error('Error al crear usuario.');
            this.saving = false;
          }
        });
      }
    }
  }

  cancel() {
    if (this.isProfileMode) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/users']);
    }
  }
}
