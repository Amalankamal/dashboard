import { EventEmitter, Injectable, Output } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import * as CryptoJS from 'crypto-js';
import { MessageDialogComponent } from "../message/message.component";
import { IApplicationConfiguration, I_ConfigDetailsJSON, TokenAccess } from "../../content/contentinterface";

@Injectable()

export class EncryptSessionService {
  mSessionName: string = "";

  constructor(
    private cMessageDialog: MatDialog,
    private cMatSnackBar: MatSnackBar
  ) { }

  key = CryptoJS.enc.Utf8.parse('99942315799894606972');//ejnmsiaowtynahairinsanahna
  iv = CryptoJS.enc.Utf8.parse('99942315799894606972');

  @Output() CurrentScreen: EventEmitter<any> = new EventEmitter();
  @Output() SaveCustomDatePickerEventEmitter: EventEmitter<any> = new EventEmitter();
  @Output() MenuChange: EventEmitter<any> = new EventEmitter();
  @Output() RefreshClickEvent: EventEmitter<any> = new EventEmitter();

  /* TM API Access Key Start */

  public SetTaskManagementAPIAccessKey(pValue: TokenAccess) {
    sessionStorage.setItem("STMAPIK", this.StringToPassword(JSON.stringify(pValue)));
  }

  public GetTaskManagementAPIAccessKey(): TokenAccess {
    let aTokenAccess: TokenAccess;
    let aAuthvalue: any;
    aAuthvalue = sessionStorage.getItem("STMAPIK");
    if (aAuthvalue === null) {
      aTokenAccess = null;
    } else {
      aTokenAccess = JSON.parse(this.PasswordToString(aAuthvalue));
    }
    return aTokenAccess;
  }
  public RemoveTaskManagementAPIAccessKey() {
    sessionStorage.removeItem("STMAPIK");
  }
  /* TM API Access Key End */

  /* Sample Methods Start*/
  public GetEncryptedValue(pDecryptPassword: string) {
    return this.StringToPassword(pDecryptPassword);
  }

  public GetDecryptedValue(pEncryptPassword: string) {
    return this.PasswordToString(pEncryptPassword);
  }

  public StringToPassword(pDecryptPassword: string): string {
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(pDecryptPassword), this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  }

  private PasswordToString(pEncryptPassword: string): string {
    var decrypted = CryptoJS.AES.decrypt(pEncryptPassword, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  /* Sample Methods End*/

  public SaveLogUserDetails(pValue) {
    var aUserdetails = btoa(this.GetEncryptedValue(JSON.stringify(pValue)));
    sessionStorage.setItem(this.mSessionName + "LUD", JSON.stringify(aUserdetails));
  }

  public GetLogUserDetails() {
    var aUser: any = null;
    let aUserValue = JSON.parse(sessionStorage.getItem(this.mSessionName + "LUD"));
    if (aUserValue === null) {
      aUser = null;
    }
    else {
      aUser = JSON.parse(this.GetDecryptedValue(atob(aUserValue)));
    }
    return aUser;
  }

  public ClearUserRightsData() {
    sessionStorage.removeItem(this.mSessionName + "UR");
    sessionStorage.removeItem(this.mSessionName + "APPCD");
  }

  public SaveUserDetails(pValue) {
    sessionStorage.setItem(this.mSessionName + "UD", JSON.stringify(pValue));
  }

  public GetUserDetails() {
    let aUserValue = sessionStorage.getItem(this.mSessionName + "UD");
    return JSON.parse(aUserValue) || null;;
  }

  public Get_ApplicationConfigurationDetails(): IApplicationConfiguration[] {
    let aIApplicationConfiguration: IApplicationConfiguration[];
    let aValue = sessionStorage.getItem(this.mSessionName + "APPCD");
    aIApplicationConfiguration = JSON.parse(aValue);
    return aIApplicationConfiguration;
  }
  public Save_ApplicationConfigurationDetails(pValue) {
    var aIApplicationConfiguration: IApplicationConfiguration[];
    aIApplicationConfiguration = pValue;
    sessionStorage.setItem(this.mSessionName + "APPCD", JSON.stringify(aIApplicationConfiguration));
  }

  SetCurrentScreenEmitter(pValue) {
    this.CurrentScreen.emit(pValue)
  }

  Subscribe_CurrentScreenEmitter() {
    return this.CurrentScreen;
  }

  onSaveCustomDatePickerEventEmitter(pValue) {
    this.SaveCustomDatePickerEventEmitter.emit(pValue);
  }

  Subscribe_OnSaveCustomDatePickerEventEmitter() {
    return this.SaveCustomDatePickerEventEmitter;
  }

  OnMenuChangeEventEmitter(pValue) {
    this.MenuChange.emit(pValue)
  }

  Subscribe_OnMenuChangeEventEmitter() {
    return this.MenuChange;
  }

  public MessageDialog(pMessageTitle: string, pMessageDetails: string, pCancelButtonVisible: Boolean, pOkButtonVisible: Boolean) {
    let aMessageDialogRef = this.cMessageDialog.open(MessageDialogComponent, {
      panelClass: 'message-dialog',
      disableClose: true
    });
    aMessageDialogRef.componentInstance.MessageTitle = pMessageTitle;
    aMessageDialogRef.componentInstance.MessageDetails = pMessageDetails;
    aMessageDialogRef.componentInstance.CancelButtonVisible = pCancelButtonVisible;
    aMessageDialogRef.componentInstance.OkButtonVisible = pOkButtonVisible;
    aMessageDialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        switch (actionType) {
          case 'Ok':
            break;
          case 'Cancel':
            break;
        }
      });
  }
  public OpenSnackBar(message: string, action: string) {
    this.cMatSnackBar.open(message, action, {
      duration: 2000,
    });
  }

  public DisableBrowserBackButton() {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  public Get_ApplicationConfigurationDetailsByConfigName(pConfigName): IApplicationConfiguration {
    let aIApplicationConfiguration: IApplicationConfiguration = {} as IApplicationConfiguration;
    let aApplicationConfigurationDetails: IApplicationConfiguration[] = this.Get_ApplicationConfigurationDetails() || [];
    if (aApplicationConfigurationDetails != null && aApplicationConfigurationDetails != undefined) {
      let aIApplicationConfigurationList = aApplicationConfigurationDetails.filter(a => a.ConfigName == pConfigName)
      if (typeof (aIApplicationConfigurationList[0]) != undefined && aIApplicationConfigurationList[0] != null) {
        aIApplicationConfiguration = aApplicationConfigurationDetails.filter(a => a.ConfigName == pConfigName)[0];
      }
      else {
        aIApplicationConfiguration = {} as IApplicationConfiguration;
        aIApplicationConfiguration._ConfigDetailsJSON = {} as I_ConfigDetailsJSON;
      }
    }
    else {
      aIApplicationConfiguration = {} as IApplicationConfiguration;
      aIApplicationConfiguration._ConfigDetailsJSON = {} as I_ConfigDetailsJSON;
    }
    return aIApplicationConfiguration;
  }

  OnRefreshClickEventEmitter(pValue) {
    this.RefreshClickEvent.emit(pValue)
  }

  Subscribe_OnRefreshClickEventEmitter() {
    return this.RefreshClickEvent;
  }
}