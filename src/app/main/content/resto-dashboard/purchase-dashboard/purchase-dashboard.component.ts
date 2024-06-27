import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html',
  styleUrls: ['./purchase-dashboard.component.scss']
})
export class PurchaseDashboardComponent implements OnInit {
  mPurchaseDetailslist = [
    {
      "Value": 123456,
      "DisplayName": "Stock on Hand",
      "CurrencyName": "AED",
      "IsDismel": true,
      "IsPercentage": false
    },
    {
      "Value": 2,
      "DisplayName": "Wastage Cost",
      "CurrencyName": "AED",
      "IsDismel": true,
      "IsPercentage": false
    },
    {
      "Value": 10,
      "DisplayName": "Total Cost",
      "CurrencyName": "AED",
      "IsDismel": false,
      "IsPercentage": true
    },
    {
      "Value": 0,
      "DisplayName": "Total Purchase",
      "CurrencyName": "AED",
      "IsDismel": true,
      "IsPercentage": false
    },
    {
      "Value": 0,
      "DisplayName": "Top profitable items",
      "CurrencyName": "AED",
      "IsDismel": true,
      "IsPercentage": false
    },
    {
      "Value": 0,
      "DisplayName": "Low Stock - Finished Goods",
      "CurrencyName": "AED",
      "IsDismel": true,
      "IsPercentage": false
    }
  ];
  mLocationsList = [];
  mSelectedLocations: any = {} as any;
  mOrderList = [];
  mSelectedOrder: any = {} as any;
  constructor() { } 

  ngOnInit() {
    this.OnAssignData();
  }

  OnAssignData() {
    for (let i = 0; i < 4; i++) {
      let a = "Locations " + i;
      let aJson = {} as any;
      aJson.Locations = JSON.parse(JSON.stringify(a));
      this.mLocationsList.push(aJson);
      a = "Order " + i;
      aJson.Order = JSON.parse(JSON.stringify(a));
      this.mOrderList.push(aJson);
    }
    this.mSelectedLocations = this.mLocationsList[0];
    this.mSelectedOrder = this.mOrderList[0];
  }

}
