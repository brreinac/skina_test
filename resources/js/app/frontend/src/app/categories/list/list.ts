import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category'; // ruta generada por CLI: services/category.ts
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class CategoriesListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  public auth = inject(AuthService);
  private router = inject(Router);

  categories: any[] = [];
  loading = false;

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    try {
      // categoryService.list() retorna Promise via firstValueFrom
      const res: any = await this.categoryService.list();
      this.categories = Array.isArray(res) ? res : (res.data || []);
    } catch (err) {
      console.error('Error cargando categorías', err);
      // opcional: mostrar notificación
    } finally {
      this.loading = false;
    }
  }

  newCategory() {
    this.router.navigate(['/categories/new']);
  }

  editCategory(id: number) {
    this.router.navigate([`/categories/edit/${id}`]);
  }

  viewCategory(id: number) {
    this.router.navigate([`/categories/view/${id}`]);
  }

  async deleteCategory(id: number) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await this.categoryService.delete(id);
      await this.load();
    } catch (err) {
      console.error('Error eliminando', err);
      alert('No se pudo eliminar la categoría');
    }
  }
}
