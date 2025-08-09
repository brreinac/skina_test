import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProductService } from "../../services/product";
import { AuthService } from "../../services/auth";

@Component({
  selector: "app-products-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./list.html",
  styleUrls: ["./list.css"]
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);
  public auth = inject(AuthService);
  public router = inject(Router);

  products: any[] = [];
  loading = false;

  async ngOnInit() { await this.load(); }

  async load() {
    this.loading = true;
    try {
      const res: any = await this.productService.list();
      this.products = Array.isArray(res) ? res : (res.data || []);
    } catch (err) { console.error(err); }
    this.loading = false;
  }

  newProduct(){ this.router.navigate(['/products/new']); }
  editProduct(id:number){ this.router.navigate([`/products/edit/${id}`]); }
  viewProduct(id:number){ this.router.navigate([`/products/view/${id}`]); }
  async deleteProduct(id:number){ if(!confirm('Eliminar producto?')) return; await this.productService.delete(id); await this.load(); }
}
