import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { SharedModule } from 'src/app/sharedmodule.module';


@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    SharedModule
  ],
  exports:[HeaderComponent],
  providers: [],
  bootstrap: []
})
export class HeaderModule { }
