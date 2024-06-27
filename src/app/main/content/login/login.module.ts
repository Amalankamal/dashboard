import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/sharedmodule.module';

const appRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(appRoutes),
        SharedModule
    ],
    exports: [LoginComponent],
    providers: [],
    bootstrap: []
})
export class LoginModule { }
