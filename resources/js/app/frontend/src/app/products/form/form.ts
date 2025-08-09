import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../services/product";
import { SubcategoryService } from "../../services/subcategory";

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./form.html",
  styleUrls: ["./form.css"]
})
export class ProductFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private productService = inject(ProductService);
  private subcategoryService = inject(SubcategoryService);

  id: number | null = null;
  name = "";
  subcategory_ids: number[] = [];
  subcategories: any[] = [];

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : null;
    try { const sc:any = await this.subcategoryService.list(); this.subcategories = Array.isArray(sc)?sc:(sc.data||[]); } catch {}
    if (this.id) {
      const p: any = await this.productService.get(this.id);
      this.name = p.name || p.nombre;
      this.subcategory_ids = (p.subcategories || []).map((s:any)=>s.id);
    }
  }

  async save() {
    const payload = { name: this.name, subcategory_ids: this.subcategory_ids };
    if (this.id) await this.productService.update(this.id, payload);
    else await this.productService.store(payload);
    this.router.navigate(['/products']);
  }
}
