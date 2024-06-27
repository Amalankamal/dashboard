import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path :'' ,
    redirectTo:'restodashboardlogin/#',
    pathMatch:'full'
  },
  {
    path: 'restodashboardlogin/:requestid',
    loadChildren: './main/content/login/login.module#LoginModule'
  },
  {
    path: 'restodashboard',
    loadChildren: './main/content/resto-dashboard/resto-dashboard.module#RestoDashboardModule'
  },
  {
    path: 'dashboardhome',
    loadChildren: './main/content/dashboardhome/dashboardhome.module#DashboardhomeModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})

// @NgModule({
//   imports: [RouterModule.forRoot(routes, { useHash: true })],
//   exports: [RouterModule]
// })
export class AppRoutingModule { }
