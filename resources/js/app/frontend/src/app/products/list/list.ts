import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/toast';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.html'
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];
  loading = false;

  constructor(private http: HttpClient, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  async load() {
    this.loading = true;
    try {
      const res: any = await this.http.get('/api/products').toPromise();
      // normalizar/añadir campos para mostrar en template
      this.products = (res || []).map((p: any) => {
        const productName = p.name ?? p.nombre ?? '';
        const subcats = p.subcategories ?? p.subcategorias ?? [];
        // categorías — cada subcategoria puede tener category o categoria
        const cats = (subcats || []).map((s: any) => s.category ?? s.categoria).filter(Boolean)
          .map((c: any) => (c.name ?? c.nombre ?? ''));

        const uniqueCats = Array.from(new Set(cats)).filter(Boolean);

        const subcatsNames = (subcats || []).map((s: any) => (s.name ?? s.nombre ?? '')).filter(Boolean);

        // devolver objeto con campos adicionales usados en template
        return {
          ...p,
          displayName: productName,
          categoriesText: uniqueCats.join(', '),
          subcategoriesText: subcatsNames.join(', ')
        };
      });
    } catch (err) {
      console.error('Error cargando productos', err);
      this.products = [];
    } finally {
      this.loading = false;
    }
  }

  // navegar a formulario crear
  createProduct() {
    this.router.navigate(['/products/new']);
  }

  // navegar a editar
  editProduct(id: number) {
    this.router.navigate(['/products/edit', id]);
  }

  // eliminar
  async deleteProduct(id: number) {
    this.toast.confirm('¿Eliminar este producto?', async () => {
      try {
        await this.http.delete(`/api/products/${id}`).toPromise();
        await this.load();
        this.toast.show('Producto eliminado correctamente', 'success');
      } catch {
        this.toast.show('No se pudo eliminar el producto.', 'danger');
      }
    });
  }
}
