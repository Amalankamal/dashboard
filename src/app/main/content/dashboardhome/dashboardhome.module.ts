import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardhomeComponent } from './dashboardhome.component';
import { SharedModule } from 'src/app/sharedmodule.module';
const appRoutes: Routes = [
  {
    path: '',
    component: DashboardhomeComponent
  }
];

@NgModule({
  declarations: [
    DashboardhomeComponent
  ],
  imports: [
    RouterModule.forChild(appRoutes),
    SharedModule
  ],
  exports: [DashboardhomeComponent],
  providers: [],
  bootstrap: []
})
export class DashboardhomeModule { }
