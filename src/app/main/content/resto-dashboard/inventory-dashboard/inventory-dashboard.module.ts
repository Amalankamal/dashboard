import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/sharedmodule.module';
import { RouterModule, Routes } from '@angular/router';
import { InventoryDashboardComponent } from './inventory-dashboard.component';
import { MyLibModule } from 'eds-d3-charts';

const appRoutes: Routes = [
  {
    path: '',
    component: InventoryDashboardComponent
  }
];

@NgModule({
  declarations: [
    InventoryDashboardComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(appRoutes),
    MyLibModule
  ],
  exports: [InventoryDashboardComponent],
  providers: [],
  bootstrap: []
})
export class InventoryDashboardModule { }
