import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/toast';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.html'
})
export class CategoriesListComponent implements OnInit {
  categories: any[] = [];
  loading = false;

  constructor(private http: HttpClient, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  async load() {
    this.loading = true;
    try {
      const res: any = await this.http.get('/api/categories').toPromise();
      this.categories = (res || []).map((c: any) => {
        const name = c.name ?? c.nombre ?? '';
        return {
          ...c,
          displayName: name,
        };
      });
    } catch (err) {
      console.error('Error cargando categorías', err);
      this.categories = [];
    } finally {
      this.loading = false;
    }
  }

  createCategory() {
    this.router.navigate(['/categories/new']);
  }

  editCategory(id: number) {
    this.router.navigate(['/categories/edit', id]);
  }

  async deleteCategory(id: number) {
    this.toast.confirm('¿Eliminar esta categoría?', async () => {
      try {
        await this.http.delete(`/api/categories/${id}`).toPromise();
        await this.load();
        this.toast.show('Categoría eliminada correctamente', 'success');
      } catch {
        this.toast.show('No se pudo eliminar la categoría.', 'danger');
      }
    });
  }
}
