import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatBadgeModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule } from '@angular/material';
import { MdePopoverModule } from '@material-extended/mde';
import { ProgressbarModule } from './main/common/progressbar/progressbar.module';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatTabsModule,
        MatSelectModule,
        MatIconModule, 
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        FlexLayoutModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatMenuModule,
        MatRadioModule,
        MatOptionModule,
        MatDialogModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatDividerModule,
        MatExpansionModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatGridListModule,
        MatSlideToggleModule,
        MatTreeModule,
        MatSidenavModule,
        MatTooltipModule,
        MatStepperModule,
        MatListModule,
        MatBadgeModule ,
        MatCheckboxModule,
        MatSortModule,
        MatSnackBarModule,
        MdePopoverModule,
        ProgressbarModule

        // CustomPipesModule,BottomSheetModule,
    ],
    declarations:[],
    exports:[CommonModule,
        FormsModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatTabsModule,
        MatSelectModule,
        MatIconModule, 
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        FlexLayoutModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatMenuModule,
        MatRadioModule,
        MatOptionModule,
        MatDialogModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatDividerModule,
        MatExpansionModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatGridListModule,
        MatSlideToggleModule,
        MatTreeModule,
        MatSidenavModule,
        MatTooltipModule,
        MatStepperModule,
        MatListModule,
        MatBadgeModule,
        MatCheckboxModule,
        MatSortModule,
        MatSnackBarModule,
        MdePopoverModule,
        ProgressbarModule,
        NgxPrintModule
        // CustomPipesModule,BottomSheetModule,
    ]

})
export class SharedModule { }