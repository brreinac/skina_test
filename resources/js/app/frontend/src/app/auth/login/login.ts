import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    this.error = '';
    try {
      await this.auth.login(this.username, this.password);
      const user = this.auth.getUser();
      localStorage.setItem('user', JSON.stringify(user));
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error = err?.error?.message ?? 'Error de autenticación';
    }
  }
}
