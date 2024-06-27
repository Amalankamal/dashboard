import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/sharedmodule.module';
import { RouterModule, Routes } from '@angular/router';
import { MyLibModule } from 'eds-d3-charts';
import { PurchaseDashboardComponent } from './purchase-dashboard.component';

const appRoutes: Routes = [
  {
    path: '',
    component: PurchaseDashboardComponent
  }
];

@NgModule({
  declarations: [
    PurchaseDashboardComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(appRoutes)
  ],
  exports: [PurchaseDashboardComponent],
  providers: [],
  bootstrap: []
})
export class  PurchaseDashboardModule { }
