import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../shared/toast';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form.html'
})
export class CategoryFormComponent implements OnInit {
  id: string | null = null;
  name = '';
  saving = false;
  loading = false;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loading = true;

    if (this.id) {
      this.http.get<any>(`/api/categories/${this.id}`, { withCredentials: true }).subscribe({
        next: (category) => {
          this.name = category.name ?? category.nombre ?? '';
        },
        error: (err) => {
          console.error('Error cargando categoría', err);
          this.toast.error('No se pudo cargar la categoría para editar.');
          this.router.navigate(['/categories']);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  save(): void {
    if (!this.name.trim()) {
      this.toast.warning('El nombre es obligatorio.');
      return;
    }

    const payload = {
      name: this.name
    };

    this.saving = true;

    const req$ = this.id
      ? this.http.put<any>(`/api/categories/${this.id}`, payload, { withCredentials: true })
      : this.http.post<any>('/api/categories', payload, { withCredentials: true });

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.toast.success('Categoría guardada correctamente.');
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        console.error('Error guardando categoría', err);
        this.saving = false;
        const msg = err?.error?.message ?? 'Error al guardar la categoría.';
        this.toast.error(msg);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
