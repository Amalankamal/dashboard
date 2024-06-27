import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { SharedModule } from '../sharedmodule.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { CustomerDatepickerFilterModule } from './common/screens/customerdatepickerfilter/customerdatepickerfilter.module';
import { MessageDialogModule } from './common/message/message.module';


const appRoutes: Routes = [
  {
    path: 'main',
    component: MainComponent
  }
];
@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    RouterModule.forChild(appRoutes),MessageDialogModule,
    SharedModule,
    HeaderModule,
    FooterModule
  ],
  exports: [MainComponent],
  providers: [],
  bootstrap: []
})
export class MainModule { }
