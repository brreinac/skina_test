// resources/js/app/frontend/src/app/products/form/form.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../shared/toast'; // ruta de tu toast.ts

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form.html'
})
export class ProductFormComponent implements OnInit {
  id: string | null = null;
  name = '';
  subcategoryIds: number[] = [];
  subcategories: any[] = [];
  saving = false;
  loading = false;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loading = true;

    // cargar subcategorías
    this.http.get<any[]>('/api/subcategories', { withCredentials: true }).subscribe({
      next: (data) => {
        this.subcategories = data || [];
      },
      error: (err) => {
        console.error('Error cargando subcategorías', err);
        this.subcategories = [];
        this.toast.error('No se pudieron cargar las subcategorías.');
      }
    });

    // cargar producto si es edición
    if (this.id) {
      this.http.get<any>(`/api/products/${this.id}`, { withCredentials: true }).subscribe({
        next: (product) => {
          this.name = product.name ?? product.nombre ?? '';
          const subs = product.subcategories ?? product.subcategorias ?? [];
          this.subcategoryIds = (subs || []).map((s: any) => Number(s.id));
        },
        error: (err) => {
          console.error('Error cargando producto', err);
          this.toast.error('No se pudo cargar el producto para editar.');
          this.router.navigate(['/products']);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  private hasSelectedSubcategory(): boolean {
    return Array.isArray(this.subcategoryIds) && this.subcategoryIds.length > 0;
  }

  save(): void {
    if (!this.name.trim()) {
      this.toast.warning('El nombre es obligatorio.');
      return;
    }

    if (!this.hasSelectedSubcategory()) {
      this.toast.warning('Debes seleccionar al menos una subcategoría.');
      return;
    }

    const payload = {
      name: this.name,
      subcategory_ids: this.subcategoryIds.map(Number)
    };

    this.saving = true;

    const req$ = this.id
      ? this.http.put<any>(`/api/products/${this.id}`, payload, { withCredentials: true })
      : this.http.post<any>('/api/products', payload, { withCredentials: true });

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.toast.success('Producto guardado correctamente.');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error guardando producto', err);
        this.saving = false;
        const msg = err?.error?.message ?? 'Error al guardar el producto.';
        this.toast.error(msg);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
