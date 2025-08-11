import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { SubcategoryService } from "../../services/subcategory";
import { AuthService } from "../../services/auth";
import { ToastService } from "../../shared/toast";

@Component({
  selector: "app-subcategories-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./list.html",
  styleUrls: ["./list.css"]
})
export class SubcategoriesListComponent implements OnInit {
  private subcategoryService = inject(SubcategoryService);
  public auth = inject(AuthService);
  public router = inject(Router);
  private toast = inject(ToastService);

  subcategories: any[] = [];
  loading = false;

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    try {
      const res: any = await this.subcategoryService.list();
      this.subcategories = Array.isArray(res) ? res : (res.data || []);
    } catch (err) {
      console.error(err);
      this.toast.error('Error cargando subcategorías');
    } finally {
      this.loading = false;
    }
  }

  newSubcategory() {
    this.router.navigate(['/subcategories/new']);
  }

  editSubcategory(id: number) {
    this.router.navigate([`/subcategories/edit/${id}`]);
  }

  viewSubcategory(id: number) {
    this.router.navigate([`/subcategories/view/${id}`]);
  }

  async deleteSubcategory(id: number) {
    this.toast.confirm('¿Eliminar esta subcategoría?', async () => {
      try {
        await this.subcategoryService.delete(id);
        await this.load();
        this.toast.show('Subcategoría eliminada correctamente', 'success');
      } catch {
        this.toast.show('No se pudo eliminar la subcategoría.', 'danger');
      }
    });
  }
}
