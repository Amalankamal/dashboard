import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import{CustomerDatepickerFilterComponent} from './customerdatepickerfilter.component';
import { SharedModule } from 'src/app/sharedmodule.module';

const appRoutes: Routes = [
    {
        path     : 'customerdatepickerfilter',
        component: CustomerDatepickerFilterComponent
    }
  ];
@NgModule({
  declarations: [
    CustomerDatepickerFilterComponent
  ],
  imports: [
    RouterModule.forChild(appRoutes),
    SharedModule
  ],
  exports:[CustomerDatepickerFilterComponent],
  providers: [],
  bootstrap: []
})
export class CustomerDatepickerFilterModule { }
