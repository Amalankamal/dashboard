import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SCREEN_TYPE } from '../../common/enumerator/commonenum';
import { ScreenConfigService } from '../../common/service/screen_config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EncryptSessionService } from '../../common/service/encryptsession.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ProgressbarComponent } from '../../common/progressbar/progressbar.component';
import { FetchService } from '../../common/service/fetch.service';
import { IAPIRequestList } from '../contentinterface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  mLoginForm: FormGroup;
  mAppVersion: string = '';
  mRouteParamsSubscribe: Subscription;
  mProgressbarDialog: any;
  mShowOverlayDiv: boolean = true;

  constructor(private cRouter: Router, private cProgressbarDialog: MatDialog, private cScreenConfigService: ScreenConfigService, private cActivatedRouter: ActivatedRoute,
    private cEncryptSessionService: EncryptSessionService, private cDatePipe: DatePipe, private cFetchService: FetchService
  ) {
    this.mRouteParamsSubscribe = this.cActivatedRouter.params.subscribe(params => {
      debugger;
      this.mLoginForm = new FormGroup({
        UserName: new FormControl('', Validators.required),
        Password: new FormControl('', Validators.required),
      });
      let aRequestData = params.requestid;
      if (aRequestData != null && aRequestData != undefined && aRequestData != "" && aRequestData != "undefined" && aRequestData != "#") {
        aRequestData = aRequestData.trim();
        this.mShowOverlayDiv = false;
        this.OnGetDecryptedValue(0, aRequestData);
      }
    });
    this.cScreenConfigService.SetScreenType(SCREEN_TYPE.LOGIN);
  }

  ngOnInit() {
    this.mAppVersion = environment.App_Version;
  }

  OnReadConnectionJson(pType) {
    if (environment.baseUrl != '') {
      if (pType == 0) {
        this.onGenerateTokenForAuthorisation();
      }
    }
    else {
      var aUpdatedata = this.cFetchService.OnReadConnectionJson();
      aUpdatedata.then((Resultdata) => {
        if (Resultdata.ResponseCode == 2000) {
          if (environment.production) {
            environment.baseUrl = Resultdata.ResponseList.WorkAtEazeConnection;
            if (pType == 0) {
              this.onGenerateTokenForAuthorisation();
            }
          }
        }
        else {
          this.cEncryptSessionService.MessageDialog("Message", Resultdata, false, true);
        }
      });
    }
  }

  onGenerateTokenForAuthorisation() {
    var aUpdatedata = this.cFetchService.GenerateAccessToken();
    aUpdatedata.then((Resultdata) => {
      if (Resultdata.ResponseCode == 200) {
        this.cEncryptSessionService.SetTaskManagementAPIAccessKey(Resultdata.ResponseList);
        this.cEncryptSessionService.ClearUserRightsData();
        this.OnRequiredControlValidationInForm(this.mLoginForm)
        if (this.mLoginForm.valid) {
          this.GetUserCredentials();
        }
      }
      else {
        this.cEncryptSessionService.MessageDialog("Message", Resultdata, false, true);
      }
    });
  }

  CreateUserCredentialsPostData() {
    let aUserName = this.mLoginForm.controls["UserName"].value;
    let aPassword = this.mLoginForm.controls["Password"].value;
    let aPostData: IAPIRequestList = {} as any;
    let aPostDataStringArray = [];
    aPostDataStringArray.push(aUserName.toString());
    aPostDataStringArray.push(aPassword.toString());
    aPostData.APIRequestList = aPostDataStringArray;
    return aPostData;
  }

  GetUserCredentials() {
    this.EnableProgressDialog();
    var aData = this.cFetchService.GetUserCredentials(this.CreateUserCredentialsPostData());
    aData.then((aResultData) => {
      this.DisableProgressDialog();
      if (aResultData.ResponseCode == 2000) {
        this.cEncryptSessionService.SaveUserDetails(aResultData.ResponseList);
        this.cScreenConfigService.SetScreenType(SCREEN_TYPE.DASHBOARD);
        this.cRouter.navigate(['./restodashboard']);
      }
      else {
        this.mShowOverlayDiv = true;
        this.cEncryptSessionService.MessageDialog("Message", aResultData, false, true);
      }
    });
  }

  OnLoginButtonClick() {
    let aOAuthKey = this.cEncryptSessionService.GetTaskManagementAPIAccessKey();
    if (typeof (aOAuthKey) != 'undefined' && aOAuthKey != null && aOAuthKey.access_token != '') {
      this.cEncryptSessionService.ClearUserRightsData();
      this.OnRequiredControlValidationInForm(this.mLoginForm)
      if (this.mLoginForm.valid) {
        this.GetUserCredentials();
      }
    }
    else {
      this.onGenerateTokenForAuthorisation();
    }
  }

  onLoginSpanclick() {
    setTimeout(() => {
      (document.getElementById("UserName") as HTMLInputElement).focus();
    }, 100);
  }

  OnRequiredControlValidationInForm(aform: FormGroup) {
    for (let key in aform.controls) {
      if (aform.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>aform.controls[key];
        if (control.validator != null) {
          const validator = control.validator({} as AbstractControl);
          if (validator && validator.required && !control.valid && !control.disabled && control.value == "") {
            control.markAsTouched();
          }
        }
      }
    }
  }

  OnGetDecryptedValue(pType, aRequestData) {
    let aParsedRequestData = null;
    try {
      aParsedRequestData = JSON.parse(this.cEncryptSessionService.GetDecryptedValue(atob(aRequestData)));
    }
    catch (error) {
      console.error("Error occurred while parsing JSON data:", error);
      aParsedRequestData = null;
      this.IntegreationLogOut();
    }

    if (aParsedRequestData != null && aParsedRequestData != undefined && aParsedRequestData != '') {
      if (aParsedRequestData.CreateDatetime != null && aParsedRequestData.CreateDatetime != undefined) {
        let aCurrentDateTime = this.cDatePipe.transform(new Date(), "yyyy-MM-dd h:mm a");
        let aCurrentDate = this.cDatePipe.transform(new Date(), "yyyy-MM-dd");
        let aGivenDate = this.cDatePipe.transform(aParsedRequestData.CreateDatetime, "yyyy-MM-dd");
        let aCurrentHour = this.cDatePipe.transform(new Date(), "h");
        let aGivenHour = this.cDatePipe.transform(aParsedRequestData.CreateDatetime, "h");
        let aCurrentMin = Number(this.cDatePipe.transform(new Date(), "mm"));
        let aCurrentTime = this.cDatePipe.transform(new Date(), "a");
        let aGivenTime = this.cDatePipe.transform(aParsedRequestData.CreateDatetime, "a");
        if (aCurrentDateTime == aParsedRequestData.CreateDatetime) {
          this.IsAllowedLogin(pType, aParsedRequestData);
        }
        else if (aCurrentDate == aGivenDate && aCurrentHour == aGivenHour && aCurrentTime == aGivenTime && aCurrentMin <= aParsedRequestData.AllowedMin) {
          this.IsAllowedLogin(pType, aParsedRequestData);
        }
        else { this.IntegreationLogOut(); }
      }
      else {
        this.IsAllowedLogin(pType, aParsedRequestData);
      }
    }
    else {
      this.IntegreationLogOut();
    }
  }

  IsAllowedLogin(pType, pRequestData) {
    this.mShowOverlayDiv = false;
    sessionStorage.removeItem("LUD");
    this.mLoginForm.controls['UserName'].setValue(pRequestData.LoginUsername);
    this.mLoginForm.controls['Password'].setValue(pRequestData.LoginPassword);
    this.cEncryptSessionService.SaveLogUserDetails(pRequestData);
    this.cScreenConfigService.OnAssignLogUserDetails(pRequestData);
    this.OnReadConnectionJson(pType);
  }

  IntegreationLogOut() {
    let aLoginUserDetails = this.cScreenConfigService.mLogUserDetails;
    if (aLoginUserDetails != null && aLoginUserDetails != undefined && aLoginUserDetails.origin != undefined) {
      let aNextUrl = aLoginUserDetails.origin;
      window.location.href = aNextUrl;
      window.location.assign(aNextUrl);
    }
    else {
      this.mShowOverlayDiv = true;
      this.cEncryptSessionService.ClearUserRightsData();
      this.cRouter.navigate(['./restodashboardlogin/#']);
    }
  }

  OnSyncClick() {
    let aLoginUserDetails = this.cScreenConfigService.mLogUserDetails;
    if (aLoginUserDetails == null) {
      let aSessionLoginUserDetails = this.cEncryptSessionService.GetLogUserDetails();
      if (aSessionLoginUserDetails != null && aSessionLoginUserDetails != undefined) {
        aLoginUserDetails = aSessionLoginUserDetails
      }
    }
    if (aLoginUserDetails != null && aLoginUserDetails != undefined) {
      this.mLoginForm.controls['UserName'].setValue(aLoginUserDetails.UserName);
      this.mLoginForm.controls['UserName'].setValue(aLoginUserDetails.UserName);
      this.onGenerateTokenForAuthorisation();
    }
  }

  DisableBrowserBackButton() {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  EnableProgressDialog() {
    Promise.resolve(null).then(() => this.mProgressbarDialog = this.cProgressbarDialog.open(ProgressbarComponent, {
      panelClass: 'progress-dialog',
      disableClose: true
    }));
  }

  DisableProgressDialog() {
    this.mProgressbarDialog.close();
  }

  ngOnDestroy() {
    this.mRouteParamsSubscribe.unsubscribe();
  }
}
