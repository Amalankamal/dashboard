import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './sharedmodule.module';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MainModule } from './main/main.module';
import { EncryptSessionService } from './main/common/service/encryptsession.service';
import { ScreenConfigService } from './main/common/service/screen_config.service';
import { APIException } from './main/common/service/apiexception';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Custom_DATE_FORMATS, MatDatePickerFormatComponent } from './main/common/service/datepickerformat';
import { FireBaseService } from './main/common/service/firebase-messaging.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './main/common/service/authinterceptor';
import { FetchService } from './main/common/service/fetch.service';
import { MessageDialogModule } from './main/common/message/message.module';

export function InitializeFirebaseConfig(cFireBaseService: FireBaseService) {
  return () => cFireBaseService.InitializeFirebaseConfigDetails();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, SharedModule,MainModule,
    HttpClientModule,MessageDialogModule,
  ],
  providers: [DatePipe, EncryptSessionService, ScreenConfigService,
    APIException, DecimalPipe, FireBaseService,FetchService,
    {
      provide: DateAdapter, useClass: MatDatePickerFormatComponent
    },
    {
      provide: MAT_DATE_FORMATS, useValue: Custom_DATE_FORMATS
    },
    {
      provide: APP_INITIALIZER,
      useFactory: InitializeFirebaseConfig,
      multi: true,
      deps: [FireBaseService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
