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

import { DashboardLayoutComponent } from './layouts/dashboard-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Categorías
      { path: 'categories', component: CategoriesListComponent },
      { path: 'categories/new', component: CategoryFormComponent, canActivate: [adminGuard] },
      { path: 'categories/edit/:id', component: CategoryFormComponent, canActivate: [adminGuard] },

      // Subcategorías
      { path: 'subcategories', component: SubcategoriesListComponent },
      { path: 'subcategories/new', component: SubcategoryFormComponent, canActivate: [adminGuard] },
      { path: 'subcategories/edit/:id', component: SubcategoryFormComponent, canActivate: [adminGuard] },

      // Productos
      { path: 'products', component: ProductsListComponent },
      { path: 'products/new', component: ProductFormComponent, canActivate: [adminGuard] },
      { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [adminGuard] },

      // Usuarios - solo admin puede lista completa y CRUD completo
      { path: 'users', component: UsersListComponent, canActivate: [adminGuard] },
      { path: 'users/new', component: UserFormComponent, canActivate: [adminGuard] },
      { path: 'users/edit/:id', component: UserFormComponent, canActivate: [adminGuard] },

      // Perfil propio para cualquier usuario autenticado
      { path: 'profile', component: UserFormComponent, canActivate: [authGuard] },
    ],
  },

  { path: '**', redirectTo: 'dashboard' }
];
