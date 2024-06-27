import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/sharedmodule.module';
import { RouterModule, Routes } from '@angular/router';
import { RestoDashboardFilterComponent } from './resto-dashboard-filter.component';
import { CustomerDatepickerFilterModule } from 'src/app/main/common/screens/customerdatepickerfilter/customerdatepickerfilter.module';

const appRoutes: Routes = [
  {
    path: '',
    component: RestoDashboardFilterComponent
  }
];

@NgModule({
  declarations: [
    RestoDashboardFilterComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(appRoutes),
    CustomerDatepickerFilterModule
  ],
  exports: [RestoDashboardFilterComponent],
  providers: [],
  bootstrap: []
})
export class RestoDashboardFilterModule { }
