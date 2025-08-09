import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../services/user";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./form.html",
  styleUrls: ["./form.css"]
})
export class UserFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private userService = inject(UserService);

  id: number | null = null;
  username = "";
  password = "";
  role = "basico";
  is_active = true;

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : null;
    if (this.id) {
      const u:any = await this.userService.get(this.id);
      this.username = u.username;
      this.role = (u.roles && u.roles[0]) ? u.roles[0] : this.role;
      this.is_active = u.is_active ?? true;
    }
  }

  async save() {
    const payload = { username: this.username, password: this.password || undefined, role: this.role, is_active: this.is_active };
    if (this.id) await this.userService.update(this.id, payload);
    else await this.userService.store(payload);
    this.router.navigate(['/users']);
  }
}
