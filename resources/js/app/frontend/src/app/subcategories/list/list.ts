import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { SubcategoryService } from "../../services/subcategory";
import { AuthService } from "../../services/auth";

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
    } finally {
      this.loading = false;
    }
  }

  newSubcategory() { this.router.navigate(['/subcategories/new']); }
  editSubcategory(id:number){ this.router.navigate([`/subcategories/edit/${id}`]); }
  viewSubcategory(id:number){ this.router.navigate([`/subcategories/view/${id}`]); }
  async deleteSubcategory(id:number){
    if(!confirm('Eliminar subcategoría?')) return;
    await this.subcategoryService.delete(id);
    await this.load();
  }
}
