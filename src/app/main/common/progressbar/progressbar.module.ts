import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressbarComponent } from './progressbar.component';

const routes = [
    {
        path: 'progressbar',
        component: ProgressbarComponent
    }
];

@NgModule({
    declarations: [
        ProgressbarComponent
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        ProgressbarComponent
    ]

})

export class ProgressbarModule {
}
