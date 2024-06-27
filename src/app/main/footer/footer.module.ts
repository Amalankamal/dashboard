import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';
import { SharedModule } from 'src/app/sharedmodule.module';


@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    SharedModule
  ],
  exports:[FooterComponent],
  providers: [],
  bootstrap: []
})
export class FooterModule { }