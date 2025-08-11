import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';  // para *ngIf, *ngFor
import { FormsModule } from '@angular/forms';    // para [(ngModel)]
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class UserFormComponent implements OnInit {

  user: any = {};                // <--- Aquí declaras user para enlazar el formulario
  saving = false;               // <--- bandera para mostrar spinner y bloquear inputs
  isProfileMode = false;        // <--- indica si estamos en modo perfil para ocultar campos
  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Detectar si estamos en modo perfil
    this.isProfileMode = this.router.url === '/profile';

    if (this.isProfileMode) {
      this.user = { ...this.authService.getUser() }; // copia usuario autenticado
      delete this.user.password; // limpiar password para que el input quede vacío
    }
  }

  async save() {
    this.saving = true;

    try {
      if (this.isProfileMode) {
        // Actualizar perfil usuario autenticado
        const data = await this.http.put('/api/profile', this.user, { withCredentials: true }).toPromise();
        // Actualizar localmente el usuario en el servicio Auth
        this.authService.setUser(this.user);
      } else if (this.user.id) {
        // Editar usuario existente
        await this.http.put(`/api/users/${this.user.id}`, this.user, { withCredentials: true }).toPromise();
      } else {
        // Crear nuevo usuario
        await this.http.post('/api/users', this.user, { withCredentials: true }).toPromise();
      }
      alert('Guardado con éxito');
      this.router.navigate(['/users']); // redirigir tras guardar
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    } finally {
      this.saving = false;
    }
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
