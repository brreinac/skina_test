import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);

  async ngOnInit() {
    try {
      await this.auth.loadUser();
      console.log('Usuario cargado en AppComponent');
    } catch (e) {
      console.warn('Error en carga usuario', e);
      // no user logged — ignore, app will show login route
      console.log('No session active');
    }
  }
}
