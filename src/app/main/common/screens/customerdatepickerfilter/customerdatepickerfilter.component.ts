import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EncryptSessionService } from '../../service/encryptsession.service';
import { ICustomDatePickerDetails } from 'src/app/main/content/contentinterface';


@Component({
  selector: 'app-customerdatepickerfilter',
  templateUrl: './customerdatepickerfilter.component.html',
  styleUrls: ['./customerdatepickerfilter.component.scss']
})

export class CustomerDatepickerFilterComponent implements OnInit {
  mSelectedOption: string = "";
  mFromDate: Date
  mToDate: Date;
  mSelectedDate: ICustomDatePickerDetails = {} as ICustomDatePickerDetails;
  mActivityForm: FormGroup;
  mCurrentDate: Date = new Date();
  mOptionsList: string[] = ['Today', 'Yesterday', 'Last 7 Days', 'Last 15 Days', 'Last 30 Days', 'Last 60 Days', 'Custom Days'];
  @Output('OnCancelData')
  OnCancelData = new EventEmitter<any>();
  @Output('OnselectOKButtonEvent')
  OnselectOKButtonEvent = new EventEmitter<any>();
  @Input('CustomDatePickerDetails') mSelectedCustomDatePickerDetail: ICustomDatePickerDetails;
  @Input('IsPendingDocDateChange') mIsPendingDocDateChange: boolean;
  @Input('IsCurrentFinancialYear') IsCurrentFinancialYear: boolean;
  CUSTOM_DATE_FILTER = {
    Custom_Date_String: 'Last 60 Days',
    Custom_Date_Count: 60
  }
  mAllowedMinDate = new Date(2000, 0, 1);
  constructor(private cEncryptSessionService: EncryptSessionService) {
    this.mActivityForm = new FormGroup({
      FromDate: new FormControl(''),
      ToDate: new FormControl(''),
    });

  }

  ngOnInit() {
    
    if (this.mSelectedCustomDatePickerDetail == null || this.mSelectedCustomDatePickerDetail == undefined) {

      let pDefaultFindFilterDateSetting = this.cEncryptSessionService.Get_ApplicationConfigurationDetailsByConfigName('IsDefaultDateFilter');
      let aCustom_Date_Filter = this.GetCustomFilterDateForFindScreen(pDefaultFindFilterDateSetting);
      this.mFromDate = aCustom_Date_Filter.FromDate;
      this.mActivityForm.controls.FromDate.setValue(this.mFromDate)
      this.mActivityForm.controls["ToDate"].setValue(aCustom_Date_Filter.ToDate)
      this.mSelectedOption = aCustom_Date_Filter.DateString;
      this.mActivityForm.controls.FromDate.disable()
      this.mActivityForm.controls["ToDate"].disable()

    }
    else {
      if (this.mIsPendingDocDateChange == true) {
        if (this.mSelectedCustomDatePickerDetail.SelectedPendingDocDateOption != undefined) {
          this.mSelectedOption = this.mSelectedCustomDatePickerDetail.SelectedPendingDocDateOption
        }
        this.mActivityForm.controls["ToDate"].setValue(this.mSelectedCustomDatePickerDetail.PendingTransaction_ToDate);
        this.mActivityForm.controls.FromDate.setValue(this.mSelectedCustomDatePickerDetail.PendingTransaction_FromDate)
      }
      else {
        if (this.mSelectedCustomDatePickerDetail.SelectedOption != undefined) {
          this.mSelectedOption = this.mSelectedCustomDatePickerDetail.SelectedOption;
        }
        this.mActivityForm.controls["ToDate"].setValue(this.mSelectedCustomDatePickerDetail.TransactionType_ToDate);
        this.mActivityForm.controls.FromDate.setValue(this.mSelectedCustomDatePickerDetail.TransactionType_FromDate)
      }
      if (this.mSelectedOption != 'Custom Days') {
        this.mActivityForm.controls.FromDate.disable()
        this.mActivityForm.controls["ToDate"].disable()
      }
    }

    if((this.IsCurrentFinancialYear == true) || (typeof this.IsCurrentFinancialYear === 'string' &&  String(this.IsCurrentFinancialYear) == 'true')){
      this.mAllowedMinDate = new Date(new Date().getFullYear(), 0, 1);
    }    
  }

  onOptionChange(pSelectedValue) {
    this.mSelectedDate.TransactionType_FromDate = new Date();
    this.mSelectedDate.TransactionType_ToDate = new Date();
    this.mSelectedDate.PendingTransaction_FromDate = new Date();
    this.mSelectedDate.PendingTransaction_ToDate = new Date();
    this.mActivityForm.controls.FromDate.disable()
    this.mActivityForm.controls["ToDate"].disable()
    this.mSelectedOption = pSelectedValue;
    if (this.mIsPendingDocDateChange == false) {

      if (pSelectedValue == 'Last 7 Days') {
        this.mSelectedDate.TransactionType_FromDate.setDate(this.mSelectedDate.TransactionType_FromDate.getDate() - 7);
      }

      else if (pSelectedValue == 'Last 15 Days') {
        this.mSelectedDate.TransactionType_FromDate.setDate(this.mSelectedDate.TransactionType_FromDate.getDate() - 15);
      }
      else if (pSelectedValue == 'Last 30 Days') {
        this.mSelectedDate.TransactionType_FromDate.setDate(this.mSelectedDate.TransactionType_FromDate.getDate() - 30);
      }
      else if (pSelectedValue == 'Last 60 Days') {
        this.mSelectedDate.TransactionType_FromDate.setDate(this.mSelectedDate.TransactionType_FromDate.getDate() - 60);
      }
      else if (pSelectedValue == 'Today') {
        this.mSelectedDate.TransactionType_FromDate = new Date();
        this.mSelectedDate.TransactionType_ToDate = new Date();
      }
      else if (pSelectedValue == 'Yesterday') {
        this.mSelectedDate.TransactionType_FromDate.setDate(this.mSelectedDate.TransactionType_FromDate.getDate() - 1);
        this.mSelectedDate.TransactionType_ToDate.setDate(this.mSelectedDate.TransactionType_ToDate.getDate() - 1);
      }
      else if (pSelectedValue == 'Tomorrow') {
        this.mSelectedDate.TransactionType_FromDate.setDate(this.mSelectedDate.TransactionType_FromDate.getDate() + 1);
        this.mSelectedDate.TransactionType_ToDate.setDate(this.mSelectedDate.TransactionType_ToDate.getDate() + 1);
      }
      this.mActivityForm.controls["ToDate"].setValue(this.mSelectedDate.TransactionType_ToDate);
      this.mActivityForm.controls["FromDate"].setValue(this.mSelectedDate.TransactionType_FromDate);
      this.mSelectedDate.SelectedOption = pSelectedValue;
    }
    else {

      if (pSelectedValue == 'Last 7 Days') {
        this.mSelectedDate.PendingTransaction_FromDate.setDate(this.mSelectedDate.PendingTransaction_FromDate.getDate() - 7);
      }

      else if (pSelectedValue == 'Last 15 Days') {
        this.mSelectedDate.PendingTransaction_FromDate.setDate(this.mSelectedDate.PendingTransaction_FromDate.getDate() - 15);
      }
      else if (pSelectedValue == 'Last 30 Days') {
        this.mSelectedDate.PendingTransaction_FromDate.setDate(this.mSelectedDate.PendingTransaction_FromDate.getDate() - 30);
      }
      else if (pSelectedValue == 'Last 60 Days') {
        this.mSelectedDate.PendingTransaction_FromDate.setDate(this.mSelectedDate.PendingTransaction_FromDate.getDate() - 60);
      }
      else if (pSelectedValue == 'Today') {
        this.mSelectedDate.PendingTransaction_FromDate = new Date();
        this.mSelectedDate.PendingTransaction_ToDate = new Date();
      }
      else if (pSelectedValue == 'Yesterday') {
        this.mSelectedDate.PendingTransaction_FromDate.setDate(this.mSelectedDate.PendingTransaction_FromDate.getDate() - 1);
        this.mSelectedDate.PendingTransaction_ToDate.setDate(this.mSelectedDate.PendingTransaction_ToDate.getDate() - 1);
      }
      else if (pSelectedValue == 'Tomorrow') {
        this.mSelectedDate.PendingTransaction_FromDate.setDate(this.mSelectedDate.PendingTransaction_FromDate.getDate() + 1);
        this.mSelectedDate.PendingTransaction_ToDate.setDate(this.mSelectedDate.PendingTransaction_ToDate.getDate() + 1);
      }
      this.mSelectedDate.SelectedPendingDocDateOption = pSelectedValue;
      this.mActivityForm.controls["ToDate"].setValue(this.mSelectedDate.PendingTransaction_ToDate);
      this.mActivityForm.controls["FromDate"].setValue(this.mSelectedDate.PendingTransaction_FromDate);
    }

    if (pSelectedValue == 'Custom Days') {
      let empty: Date;
      this.mActivityForm.controls.FromDate.enable()
      this.mActivityForm.controls["ToDate"].enable()
      this.mActivityForm.controls["FromDate"].setValue(empty);
      this.mActivityForm.controls["ToDate"].setValue(empty);
    }


  }

  onFromDateChange(value) {
    this.mFromDate = value;
    this.mActivityForm.controls["FromDate"].setValue(this.mFromDate)
    if (this.mSelectedCustomDatePickerDetail == null) {
      if (this.mIsPendingDocDateChange == true) {
        this.mSelectedDate.PendingTransaction_FromDate = this.mFromDate
      }
      else {
        this.mSelectedDate.TransactionType_FromDate = this.mFromDate
      }
    }

  }

  onToDateChange(value) {
    this.mToDate = value;
    this.mActivityForm.controls["ToDate"].setValue(this.mToDate)
    if (this.mSelectedCustomDatePickerDetail == null) {
      if (this.mIsPendingDocDateChange == true) {
        this.mSelectedDate.PendingTransaction_ToDate = this.mToDate
      }
      else {
        this.mSelectedDate.TransactionType_ToDate = this.mToDate
      }
    }
  }

  onOkButtonClick() {
    if (this.mActivityForm.controls["FromDate"].value == null ||
      this.mActivityForm.controls["FromDate"].value == "" ||
      this.mActivityForm.controls["FromDate"].value == undefined) {
      this.cEncryptSessionService.OpenSnackBar("From Date is mandatory", "");
      return;
    }
    else if (this.mActivityForm.controls["ToDate"].value == null ||
      this.mActivityForm.controls["ToDate"].value == undefined ||
      this.mActivityForm.controls["ToDate"].value == undefined) {
        this.cEncryptSessionService.OpenSnackBar("To Date is mandatory", "");
      return;
    }
    this.mSelectedDate.IsOKButtonClicked = true;

    if (this.mSelectedCustomDatePickerDetail == null) {
      let pDefaultFindFilterDateSetting = this.cEncryptSessionService.Get_ApplicationConfigurationDetailsByConfigName('IsDefaultDateFilter');
      let aCustom_Date_Filter = this.GetCustomFilterDateForFindScreen(pDefaultFindFilterDateSetting);
      if (this.mIsPendingDocDateChange == true) {
        this.mSelectedDate.TransactionType_FromDate = aCustom_Date_Filter.FromDate;
        this.mSelectedDate.TransactionType_ToDate = aCustom_Date_Filter.ToDate;
        this.mSelectedDate.SelectedOption = aCustom_Date_Filter.DateString;
      }
      else {
        this.mSelectedDate.PendingTransaction_FromDate = aCustom_Date_Filter.FromDate;
        this.mSelectedDate.PendingTransaction_ToDate = aCustom_Date_Filter.ToDate;
        this.mSelectedDate.SelectedPendingDocDateOption = aCustom_Date_Filter.DateString;
      }
    }
    else {
      if (this.mIsPendingDocDateChange == true) {
        this.mSelectedDate.PendingTransaction_FromDate = this.mActivityForm.controls["FromDate"].value
        this.mSelectedDate.PendingTransaction_ToDate = this.mActivityForm.controls["ToDate"].value
        this.mSelectedDate.SelectedPendingDocDateOption = this.mSelectedOption
        if (this.mSelectedCustomDatePickerDetail.SelectedOption != undefined) {
          this.mSelectedDate.SelectedOption = this.mSelectedCustomDatePickerDetail.SelectedOption
          this.mSelectedDate.TransactionType_FromDate = this.mSelectedCustomDatePickerDetail.TransactionType_FromDate
          this.mSelectedDate.TransactionType_ToDate = this.mSelectedCustomDatePickerDetail.TransactionType_ToDate
        }
      }
      else {
        this.mSelectedDate.TransactionType_FromDate = this.mActivityForm.controls["FromDate"].value
        this.mSelectedDate.TransactionType_ToDate = this.mActivityForm.controls["ToDate"].value
        this.mSelectedDate.SelectedOption = this.mSelectedOption
        if (this.mSelectedCustomDatePickerDetail.SelectedPendingDocDateOption != undefined) {
          this.mSelectedDate.SelectedPendingDocDateOption = this.mSelectedCustomDatePickerDetail.SelectedPendingDocDateOption
          this.mSelectedDate.PendingTransaction_FromDate = this.mSelectedCustomDatePickerDetail.PendingTransaction_FromDate
          this.mSelectedDate.PendingTransaction_ToDate = this.mSelectedCustomDatePickerDetail.PendingTransaction_ToDate
        }
      }
    }
    this.mSelectedDate.IsPendingDateChange = this.mIsPendingDocDateChange;
    this.cEncryptSessionService.onSaveCustomDatePickerEventEmitter(this.mSelectedDate)
  }
  onCancelButtonClick() {
    this.cEncryptSessionService.onSaveCustomDatePickerEventEmitter("Cancel")
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  GetCustomFilterDateForFindScreen(pDefaultFindFilterDateSetting, pType?, pDaysAgo?) {
    let aFilterData = {} as any;
    aFilterData.FromDate = new Date();
    aFilterData.ToDate = new Date();
    let aDaysAgo = 15;
    let aFromDateValue = null;
    let aIsCustomDay = false;

    if (pType == 1) {
      aDaysAgo = pDaysAgo;
    }
    else {
      if (pDefaultFindFilterDateSetting != null && typeof (pDefaultFindFilterDateSetting) != "undefined" && pDefaultFindFilterDateSetting._ConfigDetailsJSON != null && pDefaultFindFilterDateSetting._ConfigDetailsJSON != undefined) {
        if (pDefaultFindFilterDateSetting.ConfigValue != null && pDefaultFindFilterDateSetting.ConfigValue != undefined && pDefaultFindFilterDateSetting.ConfigValue != '') {
          let aDayList = ['0', '1', '7', '15', '30', '60'];
          let aConfigValue = pDefaultFindFilterDateSetting.ConfigValue.toString();
          let aIsCustomDayCheck = aDayList.includes(aConfigValue);
          if (!aIsCustomDayCheck) {
            aFromDateValue = new Date(aConfigValue);
            aIsCustomDay = true;
          }
          else {
            aDaysAgo = Number(aConfigValue);
          }
        }
        else if (pDefaultFindFilterDateSetting._ConfigDetailsJSON.FromDate != null && pDefaultFindFilterDateSetting._ConfigDetailsJSON.FromDate != undefined) {
          aFromDateValue = new Date(pDefaultFindFilterDateSetting._ConfigDetailsJSON.FromDate);
          aIsCustomDay = true;
        }
        else if (pDefaultFindFilterDateSetting._ConfigDetailsJSON.DateDefaultFilter != null && pDefaultFindFilterDateSetting._ConfigDetailsJSON.DefaultValue != undefined) {
          aDaysAgo = Number(pDefaultFindFilterDateSetting._ConfigDetailsJSON.DateDefaultFilter);
        }

        if (aIsCustomDay == true && aFromDateValue != null) {
          let aCurrentYear = new Date().getFullYear();
          let aServerYear = new Date(aFromDateValue).getFullYear();
          if (aServerYear <= aCurrentYear && aFromDateValue <= new Date()) {
            this.CUSTOM_DATE_FILTER.Custom_Date_String = 'Custom Days';
            aFilterData.DateString = 'Custom Days';
            aFilterData.FromDate = new Date(aFromDateValue);
            return aFilterData;
          }
        }
      }
    }

    if (aDaysAgo >= 0) { }
    else { aDaysAgo = 60; }

    if (aDaysAgo == 0) {
      this.CUSTOM_DATE_FILTER.Custom_Date_String = 'Today';
    }
    else if (aDaysAgo == 1) {
      this.CUSTOM_DATE_FILTER.Custom_Date_String = 'Yesterday';
    }
    else {
      let aDayList = ['0', '1', '7', '15', '30', '60'];
      let aDateValue = aDaysAgo.toString();
      let aIsCustomDayCheck = aDayList.includes(aDateValue);
      if (!aIsCustomDayCheck) {
        aFromDateValue = aDateValue;
        let aCurrentYear = new Date().getFullYear();
        let aServerYear = new Date(aFromDateValue).getFullYear();
        if (aServerYear <= aCurrentYear && aFromDateValue <= new Date()) {
          this.CUSTOM_DATE_FILTER.Custom_Date_String = 'Custom Days';
          aFilterData.DateString = 'Custom Days';
          aFilterData.FromDate = new Date(aFromDateValue);
          return aFilterData;
        }
      }
      else {
        this.CUSTOM_DATE_FILTER.Custom_Date_String = 'Last ' + aDaysAgo + ' Days';
      }
    }

    aFilterData.DateString = this.CUSTOM_DATE_FILTER.Custom_Date_String;

    let aCalculatedDate = '';
    let aCurrentDate = new Date();
    aCurrentDate.setDate(aCurrentDate.getDate() - aDaysAgo);
    let aYear = aCurrentDate.getFullYear();
    let aMonth = (aCurrentDate.getMonth() + 1).toString().padStart(2, '0');
    let aDate = aCurrentDate.getDate().toString().padStart(2, '0');
    aCalculatedDate = `${aYear}-${aMonth}-${aDate}`;
    let aFromDate = new Date(aCalculatedDate);
    aFilterData.FromDate = new Date(aFromDate);

    if (this.CUSTOM_DATE_FILTER.Custom_Date_String == 'Today') {
      aFilterData.FromDate = new Date();
    }
    else if (this.CUSTOM_DATE_FILTER.Custom_Date_String == 'Yesterday') {
      aFilterData.FromDate.setDate(aFilterData.FromDate.getDate() - 1);
      aFilterData.ToDate.setDate(aFilterData.ToDate.getDate() - 1);
    }

    return aFilterData;
  }
}