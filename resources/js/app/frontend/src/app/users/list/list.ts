import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { UserService } from "../../services/user";
import { AuthService } from "../../services/auth";

@Component({
  selector: "app-users-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./list.html",
  styleUrls: ["./list.css"]
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  public auth = inject(AuthService);
  public router = inject(Router);

  users: any[] = [];
  loading = false;

  async ngOnInit() { await this.load(); }

  async load() {
    this.loading = true;
    try { const res:any = await this.userService.list(); this.users = Array.isArray(res)?res:(res.data||[]); }
    catch(err){ console.error(err); }
    this.loading = false;
  }

  newUser(){ this.router.navigate(['/users/new']); }
  editUser(id:number){ this.router.navigate([`/users/edit/${id}`]); }
  async deleteUser(id:number){ if(!confirm('Eliminar usuario?')) return; await this.userService.delete(id); await this.load(); }
}
