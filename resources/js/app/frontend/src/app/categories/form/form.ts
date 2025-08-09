// src/app/categories/form/form.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form.html'
})
export class CategoryFormComponent {
  // Deben ser públicas para que ngModel las vea
  public nombre: string = '';
  public estado: boolean = true;
  public id: number | null = null;

  public router = inject(Router); // pública para que el template la use
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  constructor() {
    // Si estamos en modo edición, cargar datos
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.loadCategory();
    }
  }

  async loadCategory() {
    try {
      const cat: any = await this.categoryService.get(this.id!);
      this.nombre = cat.nombre;
      this.estado = cat.estado;
    } catch (err) {
      console.error('Error cargando categoría', err);
    }
  }

  async save() {
    const payload = { nombre: this.nombre, estado: this.estado };

    try {
      if (this.id) {
        await this.categoryService.update(this.id, payload);
      } else {
        await this.categoryService.store(payload);
      }
      this.router.navigate(['/categories']);
    } catch (err) {
      console.error('Error guardando categoría', err);
    }
  }
}
