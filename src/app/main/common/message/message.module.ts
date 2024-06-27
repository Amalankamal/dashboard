import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageDialogComponent } from './message.component';
import { SharedModule } from 'src/app/sharedmodule.module';
import { MatDialogModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes = [
    {
        path: 'message',
        component: MessageDialogComponent
    }
];

@NgModule({
    declarations: [
        MessageDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),SharedModule,MatDialogModule,CommonModule,FlexLayoutModule
    ],
    exports: [MessageDialogComponent]

})

export class MessageDialogModule {
}
