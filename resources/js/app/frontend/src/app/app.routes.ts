import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { CategoriesListComponent } from './categories/list/list';
import { CategoryFormComponent } from './categories/form/form';
import { SubcategoriesListComponent } from './subcategories/list/list';
import { SubcategoryFormComponent } from './subcategories/form/form';
import { ProductsListComponent } from './products/list/list';
import { ProductFormComponent } from './products/form/form';
import { UsersListComponent } from './users/list/list';
import { UserFormComponent } from './users/form/form';
import { authGuard } from './auth/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard] },
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoriesListComponent, canActivate: [authGuard] },
  { path: 'categories/new', component: CategoryFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'categories/edit/:id', component: CategoryFormComponent, canActivate: [authGuard, adminGuard] },

  { path: 'subcategories', component: SubcategoriesListComponent, canActivate: [authGuard] },
  { path: 'subcategories/new', component: SubcategoryFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'subcategories/edit/:id', component: SubcategoryFormComponent, canActivate: [authGuard, adminGuard] },

  { path: 'products', component: ProductsListComponent, canActivate: [authGuard] },
  { path: 'products/new', component: ProductFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [authGuard, adminGuard] },

  { path: 'users', component: UsersListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'users/new', component: UserFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [authGuard, adminGuard] }
];
'@ | Set-Content -Path .\src\app\app.routes.ts -Encoding utf8'
