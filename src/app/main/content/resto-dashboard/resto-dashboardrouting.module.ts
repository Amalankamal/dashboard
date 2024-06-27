import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestoDashboardComponent } from './resto-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: RestoDashboardComponent,
    },
    {
        path: 'resto-dashboard-filter',
        loadChildren: './resto-dashboard-filter/resto-dashboard-filter.module#RestoDashboardFilterModule'
    },
    {
        path: 'purchase-dashboard',
        loadChildren: './purchase-dashboard/purchase-dashboard.module#PurchaseDashboardModule'
    },
    {
        path: 'inventory-dashboard',
        loadChildren: './inventory-dashboard/inventory-dashboard.module#InventoryDashboardModule'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RestoDashboardRoutingModule { }
