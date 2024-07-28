import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import("./pages/login/login.component").then(m => m.LoginComponent)
    },
    {
        path: 'products-list',
        canActivate: [AuthGuard],
        loadComponent: () => import("./pages/products/products.component").then(m => m.ProductsComponent)
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];
