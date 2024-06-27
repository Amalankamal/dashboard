import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/sharedmodule.module';
import { RestoDashboardComponent } from './resto-dashboard.component';
import { RestoDashboardFilterModule } from './resto-dashboard-filter/resto-dashboard-filter.module';
import { InventoryDashboardModule } from './inventory-dashboard/inventory-dashboard.module';
import { PurchaseDashboardModule } from './purchase-dashboard/purchase-dashboard.module';
import { RestoDashboardRoutingModule } from './resto-dashboardrouting.module';

@NgModule({
  declarations: [
    RestoDashboardComponent
  ],
  imports: [
    SharedModule,RestoDashboardRoutingModule,
    RestoDashboardFilterModule,InventoryDashboardModule,PurchaseDashboardModule
  ],
  exports: [RestoDashboardComponent],
  providers: [],
  bootstrap: []
})
export class RestoDashboardModule { }
