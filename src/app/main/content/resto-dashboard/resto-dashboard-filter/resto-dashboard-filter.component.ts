import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';
import { Subscription } from 'rxjs';
import { EncryptSessionService } from 'src/app/main/common/service/encryptsession.service';
import { ICustomDatePickerDetails, ICustomDatePickerPopoverStyle } from '../../contentinterface';

@Component({
  selector: 'app-resto-dashboard-filter',
  templateUrl: './resto-dashboard-filter.component.html',
  styleUrls: ['./resto-dashboard-filter.component.scss']
})

export class RestoDashboardFilterComponent implements OnInit {
  mTabName:string = 'DashBoard';
  mSelectedTabName:string = 'DashBoard - Inventory';
  mFormElementJSON = [{ "MenuName": "Inventory" }, { "MenuName": "Purchase" }, { "MenuName": "Sales" },];
  mFilteredMenuFormList = [{ "MenuName": "Dashboard", "MenuIcon": "dashboard" }]
  mSelectedMenuCard = { "MenuName": "Dashboard" };
  mInternalorExternalScreen: any = {} as any;
  mFinYear = "Fin Year 2024 - 2025";
  mSelectedCustomDatePicker: ICustomDatePickerDetails = null;
  mPopoverStyle: ICustomDatePickerPopoverStyle = {} as ICustomDatePickerPopoverStyle;
  mShowPopOver: boolean = false;
  mCustomDateText: string = 'Sales';
  mSelectedDateFormat: string = '';
  Subscribe_SaveCustomDatePickerSubscription: Subscription;
  @ViewChildren(MdePopoverTrigger) PopoverList: QueryList<MdePopoverTrigger>;
  mLogUserDetails:any;
  ShowHomeIcon:boolean = false;

  constructor(private cEncryptSessionService: EncryptSessionService) {
    this.mPopoverStyle.PopoverOffsetX = 220//313;
    this.mPopoverStyle.PopoverOffsetY = 10;

    this.Subscribe_SaveCustomDatePickerSubscription = this.cEncryptSessionService.Subscribe_OnSaveCustomDatePickerEventEmitter().subscribe(aData => {
      this.mShowPopOver = false;
      this.closePopover();
      if (aData == "Cancel") { }
      else {
        var aEmittedValue: ICustomDatePickerDetails = {} as ICustomDatePickerDetails;
        aEmittedValue = aData;
        this.mSelectedDateFormat = aEmittedValue.SelectedOption;
        this.mSelectedCustomDatePicker = aData;
        this.cEncryptSessionService.OnRefreshClickEventEmitter('');
      }
    });
  }

  ngOnInit() {
    this.mSelectedCustomDatePicker = {} as any;
    this.mSelectedCustomDatePicker.IsOKButtonClicked = true;
    this.mSelectedCustomDatePicker.IsPendingDateChange = false;
    this.mSelectedCustomDatePicker.PendingTransaction_FromDate = new Date();
    this.mSelectedCustomDatePicker.PendingTransaction_ToDate = new Date();
    this.mSelectedCustomDatePicker.SelectedOption = "Today"
    this.mSelectedCustomDatePicker.SelectedPendingDocDateOption = "Today"
    this.mSelectedCustomDatePicker.TransactionType_FromDate = new Date();
    this.mSelectedCustomDatePicker.TransactionType_ToDate = new Date();
    this.mSelectedDateFormat = this.mSelectedCustomDatePicker.SelectedOption;
    this.OnSlectedMenuClick(this.mFormElementJSON[0],0);
    this.ShowHomeIcon = false;
    this.mLogUserDetails = this.cEncryptSessionService.GetLogUserDetails() || null;
    if(this.mLogUserDetails!= null && this.mLogUserDetails != undefined){
      this.ShowHomeIcon = true;
    }
  }

  OnSlectedMenuClick(pData,pType?){
    this.mSelectedTabName = this.mTabName + " - "+pData.MenuName;
    this.cEncryptSessionService.OnMenuChangeEventEmitter(pData.MenuName);
    if(pType != 0){
      this.closePopover(); 
    }
  }

  OnDateSelectionClick() {
    this.mShowPopOver = true;
  }

  OnFinYearChange(pEvent) {
    console.log(pEvent);
  }

  OnHomeClick() { 
    window.location.href = this.mLogUserDetails.href;
    window.location.assign(this.mLogUserDetails.href);
  }

  OnRefreshClick() {
    this.cEncryptSessionService.OnRefreshClickEventEmitter('');
  }

  GraphicalViewClick() { }

  OnDataViewClick() { }

  closePopover() {
    try{
      this.PopoverList.forEach(aPopover => {
        aPopover.closePopover();
      });
    }
    catch (ex){console.log('closePopover')}
  };

  ngOnDestroy() {
    this.Subscribe_SaveCustomDatePickerSubscription.unsubscribe();
  }
}
