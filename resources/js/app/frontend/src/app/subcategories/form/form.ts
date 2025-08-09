import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SubcategoryService } from "../../services/subcategory";
import { CategoryService } from "../../services/category";

@Component({
  selector: "app-subcategory-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./form.html",
  styleUrls: ["./form.css"]
})
export class SubcategoryFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private subcategoryService = inject(SubcategoryService);
  private categoryService = inject(CategoryService);

  id: number | null = null;
  name = "";
  category_id: number | null = null;
  is_active = true;
  categories: any[] = [];

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : null;
    try { const catList: any = await this.categoryService.list(); this.categories = Array.isArray(catList)?catList:(catList.data||[]); } catch {}
    if (this.id) {
      const cat: any = await this.subcategoryService.get(this.id);
      this.name = cat.name || cat.nombre;
      this.category_id = cat.category_id;
      this.is_active = cat.is_active;
    }
  }

  async save() {
    const payload = { name: this.name, category_id: this.category_id, is_active: this.is_active };
    if (this.id) await this.subcategoryService.update(this.id, payload);
    else await this.subcategoryService.store(payload);
    this.router.navigate(['/subcategories']);
  }
}
