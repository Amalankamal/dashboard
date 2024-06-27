import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ProgressbarComponent } from 'src/app/main/common/progressbar/progressbar.component';
import { EncryptSessionService } from 'src/app/main/common/service/encryptsession.service';
import { FetchService } from 'src/app/main/common/service/fetch.service';

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent implements OnInit {
  mItemCategoryList = [
    {
      "Value": 25,
      "UID": 14,
      "ItemName": "CAPITAL GOODS"
    },
    {
      "UID": 16,
      "Value": 35,
      "ItemName": "CUSTOMER ITEM"
    },
    {
      "Value": 55,
      "UID": 17,
      "ItemName": "FINISHED GOODS"
    },
    {
      "Value": 20,
      "UID": 22,
      "ItemName": "OTHERCHARGES"
    },
    {
      "Value": 32,
      "UID": 24,
      "ItemName": "PALLET ITEMS"
    },
    {
      "Value": 12,
      "UID": 25,
      "ItemName": "Default NonStandardItem Category"
    },
    {
      "Value": 11,
      "UID": 26,
      "ItemName": "NonStandardItem"
    },
    {
      "Value": 67,
      "UID": 27,
      "ItemName": "DefaultGroupItems"
    },
    {
      "Value": 89,
      "UID": 28,
      "ItemName": "VOUCHER ITEMS"
    },
    {
      "Value": 79,
      "UID": 29,
      "ItemName": "OPEN ITEM"
    },
    {
      "Value": 67,
      "UID": 101,
      "ItemName": "FOOD ITEMS"
    }
  ];
  mItemCategoryDataSource = [];
  mMainItemDetails = [
    {
      "ItemName": "Veg Burger",
      "UID": 2461,
      "Value": 10
    },
    {
      "ItemName": "Red Chilli Powder",
      "UID": 2462,
      "Value": 15
    },
    {
      "ItemName": "Cauliflower",
      "UID": 2463,
      "Value": 13
    },
    {
      "ItemName": "Chilli Gobi (cauliflower Chilli)",
      "UID": 2464,
      "Value": 90
    },
    {
      "ItemName": "Egg Noodles  123",
      "UID": 2465,
      "Value": 50
    },
    {
      "ItemName": "Egg Noodles ",
      "UID": 2466,
      "Value": 5
    },
    {
      "ItemName": "Plan Soup ",
      "UID": 2467,
      "Value": 5
    },
    {
      "ItemName": "Medium Cold Drink",
      "UID": 2468,
      "Value": 5
    },
    {
      "ItemName": "Lipton Tea",
      "UID": 2469,
      "Value": 5
    },
    {
      "ItemName": "Peshawri Qehwa",
      "UID": 2470,
      "Value": 10
    },
    {
      "ItemName": "Beef Corner",
      "UID": 2471,
      "Value": 16
    }
  ];
  mItemDetails1 = [
    {
      "ItemName": "Veg Burger",
      "UID": 2461,
      "Value": 10
    },
    {
      "ItemName": "Red Chilli Powder",
      "UID": 2462,
      "Value": 15
    },
    {
      "ItemName": "Cauliflower",
      "UID": 2463,
      "Value": 13
    },
    {
      "ItemName": "Chilli Gobi (cauliflower Chilli)",
      "UID": 2464,
      "Value": 90
    },
    {
      "ItemName": "Egg Noodles  123",
      "UID": 2465,
      "Value": 50
    },
    {
      "ItemName": "Egg Noodles ",
      "UID": 2466,
      "Value": 5
    },
    {
      "ItemName": "Plan Soup ",
      "UID": 2467,
      "Value": 5
    },
    {
      "ItemName": "Medium Cold Drink",
      "UID": 2468,
      "Value": 5
    },
    {
      "ItemName": "Lipton Tea",
      "UID": 2469,
      "Value": 5
    },
    {
      "ItemName": "Peshawri Qehwa",
      "UID": 2470,
      "Value": 10
    },
    {
      "ItemName": "Beef Corner",
      "UID": 2471,
      "Value": 16
    }
  ];
  mItemDetails = [];
  mProgressbarDialog: any;
  Subscribe_OnRefreshClickEventEmitter: Subscription;
  mDisplayedColumns = ["ItemName", "Value"];
  mTopUsageDataSource = [];
  mTopPurchasesBuyingDataSource = [];
  mDisplayedColumnsForABCAnalysis = ["Item", "Stock", "Consumption", "Purchase", "DaySinceConsumed"];
  mABCAnalysisDataSource = [];
  mSelectedROLExpiryItem: string = 'ROL Items';
  mROLExpiryItemsDataSource = [];
  mNonMovingItemsDataSource = [];
  IsShowBarGraph: boolean = false
  mSlectedStockTrendValue: string = 'Monthly';
  mBarColorsList = ['#92EE7F', '#8185E9', '#F8A35B', 'yellow'];
  mYLableList = [];
  Margin: any = { top: 30, right: 30, bottom: 20, left: 50 };
  mXaxisLabelHeight: number = -10;

  constructor(private cEncryptSessionService: EncryptSessionService, private cProgressbarDialog: MatDialog, private cFetchService: FetchService) {
    this.Subscribe_OnRefreshClickEventEmitter = this.cEncryptSessionService.Subscribe_OnRefreshClickEventEmitter().subscribe(aMenuName => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.IsShowBarGraph = false;
    this.OnAssignItemDetails();
  }

  OnAssignItemDetails() {
    this.mTopUsageDataSource = [];
    this.mTopPurchasesBuyingDataSource = [];
    this.mABCAnalysisDataSource = [];
    this.mROLExpiryItemsDataSource = [];
    this.mItemCategoryDataSource = [];
    this.mNonMovingItemsDataSource = [];
    this.mItemDetails = [];
    this.EnableProgressDialog();
    setTimeout(() => {
      this.DisableProgressDialog();
      let aItemDetails = this.GetItemJson();
      let aItemList = [];
      for (let i = 0; i < 8; i++) {
        if (i == 0) {
          this.mTopUsageDataSource = this.shuffle(aItemDetails).slice(0, 5);
        }
        else if (i == 1) {
          this.mTopPurchasesBuyingDataSource = this.shuffle(aItemDetails).slice(0, 5);
        }
        else if (i == 2) {
          this.mABCAnalysisDataSource = this.shuffle(aItemDetails).slice(0, 5);
        }
        else if (i == 3) {
          this.mROLExpiryItemsDataSource = this.shuffle(aItemDetails).slice(0, 5);
        }
        else if (i == 4) {
          this.mItemCategoryDataSource = this.shuffle(aItemDetails).slice(0, 5);
        }
        else if (i == 5) {
          this.mNonMovingItemsDataSource = this.shuffle(aItemDetails).slice(0, 5);
        }
        else if (i == 6) {
          aItemList = this.shuffle(aItemDetails).slice(0, 10);
        }
      }
      this.mTopUsageDataSource.forEach(a => {
        a.Value = (Math.random() * 100).toFixed(2);
      });
      this.mTopPurchasesBuyingDataSource.forEach(a => {
        a.Value = (Math.random() * 100).toFixed(2);
      });
      this.mABCAnalysisDataSource.forEach(a => {
        a.Value = (Math.random() * 100).toFixed(2);
        a.Stock = (Math.random() * 100).toFixed(2);
        a.Consumption = (Math.random() * 100).toFixed(2);
        a.Purchase = (Math.random() * 100).toFixed(2);
        a.DaysinceConsumption = (Math.random() * 100).toFixed(2);
      });
      this.mROLExpiryItemsDataSource.forEach(a => {
        a.Value = (Math.random() * 100).toFixed(2);
      });
      this.mItemCategoryDataSource.forEach(a => {
        a.Value = (Math.random() * 100).toFixed(2);
      });
      this.mNonMovingItemsDataSource.forEach(a => {
        a.Daysince = Math.floor(Math.random() * 31) + 1;
      });
      aItemList.forEach(a => {
        let aJson = {} as any;
        aJson.ItemName = a.ItemName;
        aJson.Issue = (Math.random() * 100).toFixed(2);
        aJson.Receipt = (Math.random() * 100).toFixed(2);
        aJson.Consumption = (Math.random() * 100).toFixed(2);
        this.mItemDetails.push(aJson);
      });
      this.mYLableList = ['Issue', 'Receipt', 'Consumption'];
      this.IsShowBarGraph = false;
      setTimeout(() => {
        this.IsShowBarGraph = true;
      }, 200);
    }, 800);
  }

  OnROLExpiryItemClick(pType) {
    this.mSelectedROLExpiryItem = pType;
    this.mROLExpiryItemsDataSource = [];
    this.EnableProgressDialog();
    setTimeout(() => {
      this.DisableProgressDialog();
      let aItemDetails = this.GetItemJson();
      this.mROLExpiryItemsDataSource = this.shuffle(aItemDetails).slice(0, 5);
      this.mROLExpiryItemsDataSource.forEach(a => {
        a.Value = (Math.random() * 100).toFixed(2);
      });
    }, 800);
  }

  OnChangeRadioButton(pEvent) {
    this.IsShowBarGraph = false;
    this.mItemDetails = [];
    this.EnableProgressDialog();
    setTimeout(() => {
      this.DisableProgressDialog();
      let aItemDetails = this.GetItemJson();
      let aItemList = this.shuffle(aItemDetails).slice(0, 10);
      aItemList.forEach(a => {
        let aJson = {} as any;
        aJson.ItemName = a.ItemName;
        aJson.Issue = (Math.random() * 100).toFixed(2);
        aJson.Receipt = (Math.random() * 100).toFixed(2);
        aJson.Consumption = (Math.random() * 100).toFixed(2);
        this.mItemDetails.push(aJson);
      });
      this.mYLableList = ['Issue', 'Receipt', 'Consumption'];
      this.IsShowBarGraph = true;
    }, 200);
  }


  OnDataSelect(pEvent) {
    console.log(pEvent)
  }
  
  OnRefreshClick(pType){
    console.log(pType);
  }

  NavigatetoTransactionDocument(pType) {
    let aJson = {} as any;
    aJson.TagName = "";
    aJson.FormElementTagName = "";
    aJson.SubFormElementTagName = "";
    aJson.StockScreenTagName = "";
    aJson.ReportScreen = "";
    aJson.IsMaster = false;
    let aSessionData = this.cEncryptSessionService.GetLogUserDetails();
    if (aSessionData != null && aSessionData != undefined) {
      if (pType == 'TopUsageItems') {
        aJson.TagName = "PURCHASE";
        aJson.ScreenName = "Material Request";
        aJson.MenuName = "Purchase";
        aJson.StockScreenTagName = "";
        aJson.ReportScreen = "";
        aJson.IsMaster = false;
      }
      var aInputJSON = btoa(this.cEncryptSessionService.GetEncryptedValue(JSON.stringify(aJson)));
      let aHerf = aSessionData.href.replace('default', aInputJSON)
      window.location.href = aHerf;
      window.location.assign(aHerf);
    }
    else {
      this.cEncryptSessionService.OpenSnackBar("User Rights Not Mapped...", "");
    }
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
    this.Subscribe_OnRefreshClickEventEmitter.unsubscribe();
  }

  private shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  GetItemJson(){
    let aItemDetails = [
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2666
        },
        "UID": 2667,
        "ItemCode": "FGI0050",
        "ItemName": "Rice Sevai",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOD MENU"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOD MENU"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 736
        },
        "ItemGroup": "Food MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 942
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2383
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2386
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOD MENU",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20839
          },
          "TaskID": 20840,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2667
        },
        "UID": 2668,
        "ItemCode": "FGI0051",
        "ItemName": "T.t Cola Doom",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20840
          },
          "TaskID": 20841,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2668
        },
        "UID": 2669,
        "ItemCode": "FGI0052",
        "ItemName": "Tt Brown Doom",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20841
          },
          "TaskID": 20842,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2669
        },
        "UID": 2670,
        "ItemCode": "WER0532",
        "ItemName": "Eyelet Ring",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 8,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 7
              },
              "UOMUID": 8,
              "UOM": "PACKS",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 7
                  },
                  "UOMUID": 8,
                  "UOM": "PACKS",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "PACKS",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 7
        },
        "UOMUID": 8,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20842
          },
          "TaskID": 20843,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2670
        },
        "UID": 2671,
        "ItemCode": "WER0533",
        "ItemName": "S.s Single Clamp",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20843
          },
          "TaskID": 20844,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2671
        },
        "UID": 2672,
        "ItemCode": "WER0534",
        "ItemName": "S.s Double Clamp",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20844
          },
          "TaskID": 20845,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  7:09AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2614
        },
        "UID": 2615,
        "ItemCode": "FGI0007",
        "ItemName": "Painters Tape",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2380
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20787
          },
          "TaskID": 20788,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2615
        },
        "UID": 2616,
        "ItemCode": "FGI0008",
        "ItemName": "Paint Tray",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2380
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20788
          },
          "TaskID": 20789,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2616
        },
        "UID": 2617,
        "ItemCode": "FGI0009",
        "ItemName": "Putty Knife Ss",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2380
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20789
          },
          "TaskID": 20790,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2617
        },
        "UID": 2618,
        "ItemCode": "FGI0010",
        "ItemName": "Timber",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2380
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20790
          },
          "TaskID": 20791,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2618
        },
        "UID": 2619,
        "ItemCode": "FGI0011",
        "ItemName": "Mesh",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2380
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20791
          },
          "TaskID": 20792,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2619
        },
        "UID": 2620,
        "ItemCode": "FGI0012",
        "ItemName": "Mesh1",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2380
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20792
          },
          "TaskID": 20793,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2620
        },
        "UID": 2621,
        "ItemCode": "FGI0013",
        "ItemName": "Chain Link",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2380
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20793
          },
          "TaskID": 20794,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2621
        },
        "UID": 2622,
        "ItemCode": "FGI0014",
        "ItemName": "Plywood",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2380
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20794
          },
          "TaskID": 20795,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2622
        },
        "UID": 2623,
        "ItemCode": "FGI0015",
        "ItemName": "Blocks",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20795
          },
          "TaskID": 20796,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2623
        },
        "UID": 2624,
        "ItemCode": "FGI0016",
        "ItemName": "Chain Saw",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20796
          },
          "TaskID": 20797,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2624
        },
        "UID": 2625,
        "ItemCode": "FGI0017",
        "ItemName": "Corrugated Iron",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20797
          },
          "TaskID": 20798,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2625
        },
        "UID": 2626,
        "ItemCode": "FGI0018",
        "ItemName": "Corrugated Iron",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 5,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 4
              },
              "UOMUID": 5,
              "UOM": "Kgs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 4
                  },
                  "UOMUID": 5,
                  "UOM": "Kgs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Kgs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 4
        },
        "UOMUID": 5,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20798
          },
          "TaskID": 20799,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2626
        },
        "UID": 2627,
        "ItemCode": "SFGI0001",
        "ItemName": "Boards",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20799
          },
          "TaskID": 20800,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2627
        },
        "UID": 2628,
        "ItemCode": "SFGI0002",
        "ItemName": "Tools",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20800
          },
          "TaskID": 20801,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:51AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2628
        },
        "UID": 2629,
        "ItemCode": "SFGI0003",
        "ItemName": "Electrical Items",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20801
          },
          "TaskID": 20802,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2629
        },
        "UID": 2630,
        "ItemCode": "SFGI0004",
        "ItemName": "Steel",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 5,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 4
              },
              "UOMUID": 5,
              "UOM": "Kgs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 4
                  },
                  "UOMUID": 5,
                  "UOM": "Kgs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Kgs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 4
        },
        "UOMUID": 5,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20802
          },
          "TaskID": 20803,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2630
        },
        "UID": 2631,
        "ItemCode": "SFGI0005",
        "ItemName": "Paints",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20803
          },
          "TaskID": 20804,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2631
        },
        "UID": 2632,
        "ItemCode": "SFGI0006",
        "ItemName": "Pvc Fittings",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 2,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 1
              },
              "UOMUID": 2,
              "UOM": "Pcs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 1
                  },
                  "UOMUID": 2,
                  "UOM": "Pcs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Pcs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 1
        },
        "UOMUID": 2,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20804
          },
          "TaskID": 20805,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2632
        },
        "UID": 2633,
        "ItemCode": "SFGI0007",
        "ItemName": "Flashing",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 2,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 1
              },
              "UOMUID": 2,
              "UOM": "Pcs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 1
                  },
                  "UOMUID": 2,
                  "UOM": "Pcs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Pcs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 1
        },
        "UOMUID": 2,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20805
          },
          "TaskID": 20806,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2633
        },
        "UID": 2634,
        "ItemCode": "SFGI0008",
        "ItemName": "Hygear Mens Sharpy Slippers",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20806
          },
          "TaskID": 20807,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2634
        },
        "UID": 2635,
        "ItemCode": "SFGI0009",
        "ItemName": "Attitudist Men's Handcrafted Brown Leather Slipper",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20807
          },
          "TaskID": 20808,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2635
        },
        "UID": 2636,
        "ItemCode": "SFGI0010",
        "ItemName": "Monoction Soft Eva Clogs Walking Slipper For Men Slides",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20808
          },
          "TaskID": 20809,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2636
        },
        "UID": 2637,
        "ItemCode": "SFGI0011",
        "ItemName": "Hygear Mens Xpress Slipper",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20809
          },
          "TaskID": 20810,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2637
        },
        "UID": 2638,
        "ItemCode": "SFGI0012",
        "ItemName": "Flite Men's Fl0330g Slippers",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20810
          },
          "TaskID": 20811,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2638
        },
        "UID": 2639,
        "ItemCode": "SFGI0013",
        "ItemName": "Hygear Mens Cosmos Slippers",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20811
          },
          "TaskID": 20812,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2639
        },
        "UID": 2640,
        "ItemCode": "SFGI0014",
        "ItemName": "Birde Men Premium Eva Slippers",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20812
          },
          "TaskID": 20813,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2640
        },
        "UID": 2641,
        "ItemCode": "SFGI0015",
        "ItemName": "Doctor Extra Soft Doctor Ortho Slippers For Women",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20813
          },
          "TaskID": 20814,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2641
        },
        "UID": 2642,
        "ItemCode": "SFGI0016",
        "ItemName": "Yoho Women Eva Bubbles",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20814
          },
          "TaskID": 20815,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2642
        },
        "UID": 2643,
        "ItemCode": "234588678",
        "ItemName": "Flite Women Daily Use Slippers",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20815
          },
          "TaskID": 20816,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2643
        },
        "UID": 2644,
        "ItemCode": "234588679",
        "ItemName": "Doctor Extra Soft Womens D-19 Slipper",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20816
          },
          "TaskID": 20817,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2644
        },
        "UID": 2645,
        "ItemCode": "234588680",
        "ItemName": "Duosoft Vstd-110086-011-black Extra Soft Doctor Ortho Slippers",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20817
          },
          "TaskID": 20818,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2645
        },
        "UID": 2646,
        "ItemCode": "234588681",
        "ItemName": "Duosoft Vstd-110086-021-black Simmer Extra Soft Doctor Ortho",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "FOOTWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST5%Commodity",
        "CommodityDescription": "HSNCommodity5",
        "CommodityType": "HSN",
        "CommodityPercentage": 2.5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 940
        },
        "ItemGroup": "FOOTWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 941
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2382
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2385
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "FOOTWARE",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20818
          },
          "TaskID": 20819,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2646
        },
        "UID": 2647,
        "ItemCode": "234588682",
        "ItemName": "1 1/4 * 1/4 Angle",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 5,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 4
              },
              "UOMUID": 5,
              "UOM": "Kgs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 4
                  },
                  "UOMUID": 5,
                  "UOM": "Kgs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Kgs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 4
        },
        "UOMUID": 5,
        "CommodityCode": "GST18%Commodity",
        "CommodityDescription": "HSNCommodity18",
        "CommodityType": "HSN",
        "CommodityPercentage": 9,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20819
          },
          "TaskID": 20820,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2647
        },
        "UID": 2648,
        "ItemCode": "234588683",
        "ItemName": "25*25 Pipe",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 5,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 4
              },
              "UOMUID": 5,
              "UOM": "Kgs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 4
                  },
                  "UOMUID": 5,
                  "UOM": "Kgs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Kgs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 4
        },
        "UOMUID": 5,
        "CommodityCode": "GST18%Commodity",
        "CommodityDescription": "HSNCommodity18",
        "CommodityType": "HSN",
        "CommodityPercentage": 9,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20820
          },
          "TaskID": 20821,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2648
        },
        "UID": 2649,
        "ItemCode": "WER0521",
        "ItemName": "Note",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20821
          },
          "TaskID": 20822,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:52AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2649
        },
        "UID": 2650,
        "ItemCode": "WER0522",
        "ItemName": "Book",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20822
          },
          "TaskID": 20823,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2650
        },
        "UID": 2651,
        "ItemCode": "WER0523",
        "ItemName": "Commercial",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20823
          },
          "TaskID": 20824,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2651
        },
        "UID": 2652,
        "ItemCode": "WER0524",
        "ItemName": "Copper",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20824
          },
          "TaskID": 20825,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2652
        },
        "UID": 2653,
        "ItemCode": "WER0525",
        "ItemName": "Brass",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20825
          },
          "TaskID": 20826,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2653
        },
        "UID": 2654,
        "ItemCode": "WER0526",
        "ItemName": "Vitten Box",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20826
          },
          "TaskID": 20827,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2654
        },
        "UID": 2655,
        "ItemCode": "WER0527",
        "ItemName": "Ai",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20827
          },
          "TaskID": 20828,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2655
        },
        "UID": 2656,
        "ItemCode": "WER0528",
        "ItemName": "Asian Paint Blue",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20828
          },
          "TaskID": 20829,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2656
        },
        "UID": 2657,
        "ItemCode": "WER0529",
        "ItemName": "Asian Paint Black",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20829
          },
          "TaskID": 20830,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2657
        },
        "UID": 2658,
        "ItemCode": "WER0530",
        "ItemName": "Asian Paint Red",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20830
          },
          "TaskID": 20831,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2658
        },
        "UID": 2659,
        "ItemCode": "WER0531",
        "ItemName": "Asian Paint Pink",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20831
          },
          "TaskID": 20832,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2659
        },
        "UID": 2660,
        "ItemCode": "ITC0012",
        "ItemName": "Nippon Paint Green",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "TRADING GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 103
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20832
          },
          "TaskID": 20833,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2660
        },
        "UID": 2661,
        "ItemCode": "ITC0013",
        "ItemName": "Nippon Paint Violet",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "TRADING GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 103
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20833
          },
          "TaskID": 20834,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2661
        },
        "UID": 2662,
        "ItemCode": "ITC0014",
        "ItemName": "Nippon Paint Black",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "TRADING GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 103
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20834
          },
          "TaskID": 20835,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2662
        },
        "UID": 2663,
        "ItemCode": "ITC0015",
        "ItemName": "Berger Paint Blue",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "ServiceItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2384
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "SERVICE GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 119
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20835
          },
          "TaskID": 20836,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2663
        },
        "UID": 2664,
        "ItemCode": "ITC0016",
        "ItemName": "Berger Paint White",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "ServiceItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "SERVICE GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 119
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20836
          },
          "TaskID": 20837,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2664
        },
        "UID": 2665,
        "ItemCode": "ITC0017",
        "ItemName": "Sheenlac Paint Brown",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "ServiceItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2381
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "SERVICE GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 119
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20837
          },
          "TaskID": 20838,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2665
        },
        "UID": 2666,
        "ItemCode": "ITC0041",
        "ItemName": "Fried Kebbeh",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Grills"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 217
        },
        "ItemGroup": "Food Menu test",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 219
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 1166
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Appetizers",
        "QOH": 0,
        "ItemCategory": "FOOD ITEMS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 101
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20838
          },
          "TaskID": 20839,
          "TaskTitle": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskDetail": "Default Item Template Dated Jun 14 2024  5:53AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2560
        },
        "UID": 2561,
        "ItemCode": "234588698",
        "ItemName": "Kalan",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20629
          },
          "TaskID": 20630,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 11:33AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 11:33AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2561
        },
        "UID": 2562,
        "ItemCode": "234588699",
        "ItemName": "Kalan Parcel",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20630
          },
          "TaskID": 20631,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 11:34AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 11:34AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2562
        },
        "UID": 2563,
        "ItemCode": "rd0095",
        "ItemName": "Pani Poori",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20631
          },
          "TaskID": 20632,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 11:34AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 11:34AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2563
        },
        "UID": 2564,
        "ItemCode": "rd0096",
        "ItemName": "Pani Poori Parcel",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20632
          },
          "TaskID": 20633,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 11:34AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 11:34AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2557
        },
        "UID": 2558,
        "ItemCode": "rd00369",
        "ItemName": "Cheese Pizza",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Appetizers"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "Appetizers"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT0%Commodity",
        "CommodityDescription": "VAT@0%",
        "CommodityType": "VAT",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 217
        },
        "ItemGroup": "Food Menu test",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 345
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 1163
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 1255
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Snacks",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20626
          },
          "TaskID": 20627,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:32AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:32AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2550
        },
        "UID": 2551,
        "ItemCode": "rd0092",
        "ItemName": "Veg Puff",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20619
          },
          "TaskID": 20620,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2551
        },
        "UID": 2552,
        "ItemCode": "rd0093",
        "ItemName": "Nattuchakarai Tea",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20620
          },
          "TaskID": 20621,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2552
        },
        "UID": 2553,
        "ItemCode": "rd0094",
        "ItemName": "Nattuchakarai Tea Parcel",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "CAPITAL GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 13
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20621
          },
          "TaskID": 20622,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2553
        },
        "UID": 2554,
        "ItemCode": "234588689",
        "ItemName": "Coffee",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20622
          },
          "TaskID": 20623,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2554
        },
        "UID": 2555,
        "ItemCode": "234588690",
        "ItemName": "Coffee Parcel",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2356
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20623
          },
          "TaskID": 20624,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2555
        },
        "UID": 2556,
        "ItemCode": "234588691",
        "ItemName": "Nattuchakarai Coffee",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "PAINT"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2356
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2360
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20624
          },
          "TaskID": 20625,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2556
        },
        "UID": 2557,
        "ItemCode": "234588692",
        "ItemName": "Hot Badam Milk",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20625
          },
          "TaskID": 20626,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:28AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2542
        },
        "UID": 2543,
        "ItemCode": "FGI0001",
        "ItemName": "Lemon Tea",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2356
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2358
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20611
          },
          "TaskID": 20612,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2543
        },
        "UID": 2544,
        "ItemCode": "FGI0002",
        "ItemName": "Green Tea",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2356
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2358
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20612
          },
          "TaskID": 20613,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2544
        },
        "UID": 2545,
        "ItemCode": "FGI0003",
        "ItemName": "Masal Tea",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2356
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2358
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20613
          },
          "TaskID": 20614,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2545
        },
        "UID": 2546,
        "ItemCode": "FGI0004",
        "ItemName": "Boost",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "HARDWARE"
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 884
        },
        "ItemGroup": "HARDWARE",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 887
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2356
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2358
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "HARDWARE",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20614
          },
          "TaskID": 20615,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2546
        },
        "UID": 2547,
        "ItemCode": "234588693",
        "ItemName": "Horlicks",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20615
          },
          "TaskID": 20616,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2547
        },
        "UID": 2548,
        "ItemCode": "234588700",
        "ItemName": "Bhel Poori",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 885
        },
        "ItemGroup": "scrap Item",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 888
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "scrap Item",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20616
          },
          "TaskID": 20617,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2548
        },
        "UID": 2549,
        "ItemCode": "234588701",
        "ItemName": "Bhel Poori Parcel",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20617
          },
          "TaskID": 20618,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2549
        },
        "UID": 2550,
        "ItemCode": "FGI0005",
        "ItemName": "Masal Poori",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [
          {
            "vAttributeValue": "scrap "
          }
        ],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "GST0%Commodity",
        "CommodityDescription": "GST 0%",
        "CommodityType": "HSN",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 886
        },
        "ItemGroup": "Paint",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 889
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2357
            }
          },
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2359
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Paint Lot",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20618
          },
          "TaskID": 20619,
          "TaskTitle": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskDetail": "Default Item Template Dated Jun  7 2024 10:26AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2537
        },
        "UID": 2538,
        "ItemCode": "rd0091",
        "ItemName": "Fried Rice",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 5,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 4
              },
              "UOMUID": 5,
              "UOM": "Kgs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 4
                  },
                  "UOMUID": 5,
                  "UOM": "Kgs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-06-06 15:18:45:45",
            "M2024-06-06 15:18:45:45"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": true,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Kgs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 4
        },
        "UOMUID": 5,
        "CommodityCode": "VAT0%Commodity",
        "CommodityDescription": "VAT@0%",
        "CommodityType": "VAT",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 736
        },
        "ItemGroup": "Food MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 827
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Snacks",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20594
          },
          "TaskID": 20595,
          "TaskTitle": "Default Item Template Dated Jun  6 2024  9:48AM",
          "TaskDetail": "Default Item Template Dated Jun  6 2024  9:48AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": true
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2536
        },
        "UID": 2537,
        "ItemCode": "RW0033",
        "ItemName": "Water",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 4,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 3
              },
              "UOMUID": 4,
              "UOM": "LTR",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 3
                  },
                  "UOMUID": 4,
                  "UOM": "LTR",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-06-06 15:16:12:92",
            "M2024-06-07 15:50:23:82"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "LTR",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 3
        },
        "UOMUID": 4,
        "CommodityCode": "VAT0%Commodity",
        "CommodityDescription": "VAT@0%",
        "CommodityType": "VAT",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 609
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Raw Materials",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20593
          },
          "TaskID": 20594,
          "TaskTitle": "Default Item Template Dated Jun  6 2024  9:46AM",
          "TaskDetail": "Default Item Template Dated Jun  6 2024  9:46AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2535
        },
        "UID": 2536,
        "ItemCode": "BR001",
        "ItemName": "Boiled Rice",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 5,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 4
              },
              "UOMUID": 5,
              "UOM": "Kgs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 4
                  },
                  "UOMUID": 5,
                  "UOM": "Kgs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-06-06 15:14:11:81",
            "M2024-06-06 15:14:11:81"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": true,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Kgs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 4
        },
        "UOMUID": 5,
        "CommodityCode": "VAT0%Commodity",
        "CommodityDescription": "VAT@0%",
        "CommodityType": "VAT",
        "CommodityPercentage": 0,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 308
        },
        "ItemGroup": "Semi Finished Items",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 428
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Semi Finished Items",
        "QOH": 0,
        "ItemCategory": "SEMI FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 121
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20591
          },
          "TaskID": 20592,
          "TaskTitle": "Default Item Template Dated Jun  6 2024  9:44AM",
          "TaskDetail": "Default Item Template Dated Jun  6 2024  9:44AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": true
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2534
        },
        "UID": 2535,
        "ItemCode": "rd0090",
        "ItemName": "Mutton Haleem",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 6,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 5
              },
              "UOMUID": 6,
              "UOM": "BOX",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 5
                  },
                  "UOMUID": 6,
                  "UOM": "BOX",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": true,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-06-05 14:09:12:13",
            "M2024-06-07 20:44:20:80"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": true,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "BOX",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 5
        },
        "UOMUID": 6,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 625
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Homemade Icrecream",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 20575
          },
          "TaskID": 20576,
          "TaskTitle": "Default Item Template Dated Jun  5 2024  8:39AM",
          "TaskDetail": "Default Item Template Dated Jun  5 2024  8:39AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": true
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2460
        },
        "UID": 2461,
        "ItemCode": "VB001",
        "ItemName": "Veg Burger",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 2,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 1
              },
              "UOMUID": 2,
              "UOM": "Pcs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 1
                  },
                  "UOMUID": 2,
                  "UOM": "Pcs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                },
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 5
                  },
                  "UOMUID": 6,
                  "UOM": "BOX",
                  "Conv": 10,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 10,
                  "ConvDecimalPlace": 3,
                  "IsDefault": false,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            },
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 5
              },
              "UOMUID": 6,
              "UOM": "BOX",
              "Conv": 10,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 10,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 5
                  },
                  "UOMUID": 6,
                  "UOM": "BOX",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": false,
                  "IsActive": true
                }
              ],
              "IsDefault": false,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-05-20 14:32:46:62",
            "M2024-06-07 17:36:10:01"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Pcs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 1
        },
        "UOMUID": 2,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 731
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Vegetables",
        "QOH": 0,
        "ItemCategory": "FOOD ITEMS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 101
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19471
          },
          "TaskID": 19472,
          "TaskTitle": "Default Item Template Dated May 20 2024  9:02AM",
          "TaskDetail": "Default Item Template Dated May 20 2024  9:02AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2459
        },
        "UID": 2460,
        "ItemCode": "R008",
        "ItemName": "Red Chilli Powder",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 5,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 4
              },
              "UOMUID": 5,
              "UOM": "Kgs",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 4
                  },
                  "UOMUID": 5,
                  "UOM": "Kgs",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-05-17 18:19:12:39",
            "M2024-05-17 18:19:12:39"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": null,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Kgs",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 4
        },
        "UOMUID": 5,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 226
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Groceries",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19406
          },
          "TaskID": 19407,
          "TaskTitle": "Default Item Template Dated May 17 2024 12:49PM",
          "TaskDetail": "Default Item Template Dated May 17 2024 12:49PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2458
        },
        "UID": 2459,
        "ItemCode": "Cu0007",
        "ItemName": "Cauliflower",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-05-17 18:18:02:14",
            "M2024-05-17 18:18:02:14"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": null,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19405
          },
          "TaskID": 19406,
          "TaskTitle": "Default Item Template Dated May 17 2024 12:48PM",
          "TaskDetail": "Default Item Template Dated May 17 2024 12:48PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2457
        },
        "UID": 2458,
        "ItemCode": "00777",
        "ItemName": "Chilli Gobi (cauliflower Chilli)",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-05-17 18:15:56:80",
            "M2024-05-17 18:16:38:35"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 417
        },
        "ItemGroup": "Cream",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 651
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "fast food subgroup",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19404
          },
          "TaskID": 19405,
          "TaskTitle": "Default Item Template Dated May 17 2024 12:45PM",
          "TaskDetail": "Default Item Template Dated May 17 2024 12:45PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2455
        },
        "UID": 2456,
        "ItemCode": "567ytyu",
        "ItemName": "Egg Noodles 123",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2024-06-04 11:47:55:88"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "test"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 417
        },
        "ItemGroup": "Cream",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 651
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2343
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "fast food subgroup",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19327
          },
          "TaskID": 19328,
          "TaskTitle": "Default Item Template Dated May 16 2024  5:16AM",
          "TaskDetail": "Default Item Template Dated May 16 2024  5:16AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2453
        },
        "UID": 2454,
        "ItemCode": "rd0087",
        "ItemName": "Egg Noodles",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "test"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 400
        },
        "ItemGroup": "Fast food test",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 401
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2343
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "fast food subgroup",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19325
          },
          "TaskID": 19326,
          "TaskTitle": "Default Item Template Dated May 16 2024  5:12AM",
          "TaskDetail": "Default Item Template Dated May 16 2024  5:12AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2454
        },
        "UID": 2455,
        "ItemCode": "rd0088",
        "ItemName": "Egg Noodles",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "test"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 400
        },
        "ItemGroup": "Fast food test",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 401
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2343
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "fast food subgroup",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19326
          },
          "TaskID": 19327,
          "TaskTitle": "Default Item Template Dated May 16 2024  5:15AM",
          "TaskDetail": "Default Item Template Dated May 16 2024  5:15AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2451
        },
        "UID": 2452,
        "ItemCode": "1988",
        "ItemName": "Egg Noodles",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "test"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 400
        },
        "ItemGroup": "Fast food test",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 401
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2343
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "fast food subgroup",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19282
          },
          "TaskID": 19283,
          "TaskTitle": "Default Item Template Dated May 14 2024 12:25PM",
          "TaskDetail": "Default Item Template Dated May 14 2024 12:25PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2450
        },
        "UID": 2451,
        "ItemCode": "F34",
        "ItemName": "Plan Soup",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                },
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 7
                  },
                  "UOMUID": 8,
                  "UOM": "PACKS",
                  "Conv": 0.5,
                  "DecimalPlace": 3,
                  "ActualConv": 2,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": false,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            },
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 7
              },
              "UOMUID": 8,
              "UOM": "PACKS",
              "Conv": 0.5,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 2,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 7
                  },
                  "UOMUID": 8,
                  "UOM": "PACKS",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": false,
                  "IsActive": true
                }
              ],
              "IsDefault": false,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": true,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-05-14 14:12:58:53",
            "M2024-06-04 11:56:31:58"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 217
        },
        "ItemGroup": "Food Menu test",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 594
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Vegetable Soup",
        "QOH": 0,
        "ItemCategory": "FOOD ITEMS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 101
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19263
          },
          "TaskID": 19264,
          "TaskTitle": "Default Item Template Dated May 14 2024  8:43AM",
          "TaskDetail": "Default Item Template Dated May 14 2024  8:43AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2450
        },
        "UID": 2451,
        "ItemCode": "F34",
        "ItemName": "Plan Soup",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                },
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 7
                  },
                  "UOMUID": 8,
                  "UOM": "PACKS",
                  "Conv": 0.5,
                  "DecimalPlace": 3,
                  "ActualConv": 2,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": false,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            },
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 7
              },
              "UOMUID": 8,
              "UOM": "PACKS",
              "Conv": 0.5,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 2,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 7
                  },
                  "UOMUID": 8,
                  "UOM": "PACKS",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": false,
                  "IsActive": true
                }
              ],
              "IsDefault": false,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": true,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2024-05-14 14:12:58:53",
            "M2024-06-04 11:56:31:58"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": 0,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 522
        },
        "ItemGroup": "Desserts",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 594
        },
        "_DineGroupNodeIDList": [],
        "IsAddon": false,
        "ItemSubGroup": "Vegetable Soup",
        "QOH": 0,
        "ItemCategory": "FOOD ITEMS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 101
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19263
          },
          "TaskID": 19264,
          "TaskTitle": "Default Item Template Dated May 14 2024  8:43AM",
          "TaskDetail": "Default Item Template Dated May 14 2024  8:43AM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2446
        },
        "UID": 2447,
        "ItemCode": "686623",
        "ItemName": "Sulaimani",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 2
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": true,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19098
          },
          "TaskID": 19099,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:59PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:59PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2447
        },
        "UID": 2448,
        "ItemCode": "rd0084",
        "ItemName": "Medium Cold Drink",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "FOOD ITEMS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 101
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19099
          },
          "TaskID": 19100,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:59PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:59PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2448
        },
        "UID": 2449,
        "ItemCode": "598784",
        "ItemName": "Lipton Tea",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 5
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19100
          },
          "TaskID": 19101,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:59PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:59PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2449
        },
        "UID": 2450,
        "ItemCode": "rd0085",
        "ItemName": "Peshawri Qehwa",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "FOOD ITEMS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 101
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19101
          },
          "TaskID": 19102,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:59PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:59PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2441
        },
        "UID": 2442,
        "ItemCode": "rd0079",
        "ItemName": "Pepsi",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "RAW MATERIALS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 102
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19090
          },
          "TaskID": 19091,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": false,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2442
        },
        "UID": 2443,
        "ItemCode": "rd0080",
        "ItemName": "Diet Pepsi",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 2
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19091
          },
          "TaskID": 19092,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2443
        },
        "UID": 2444,
        "ItemCode": "rd0081",
        "ItemName": "Coke",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "FOOD ITEMS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 101
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19092
          },
          "TaskID": 19093,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2444
        },
        "UID": 2445,
        "ItemCode": "rd0082",
        "ItemName": "Diet Coke",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 5
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "FINISHED GOODS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 16
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19093
          },
          "TaskID": 19094,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      },
      {
        "_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "Items",
          "id": 2445
        },
        "UID": 2446,
        "ItemCode": "rd0083",
        "ItemName": "Fanta",
        "ItemDescription": "",
        "ItemType": "4",
        "_ItemJSON": {
          "AdditionalDetails": "",
          "UOM_UID": 1,
          "SalesDescription": "",
          "ConversionUOM": [
            {
              "uom_node_id": {
                "type": "node",
                "schema": "dbo",
                "table": "UOM",
                "id": 0
              },
              "UOMUID": 1,
              "UOM": "Nos",
              "Conv": 1,
              "DecimalPlace": 3,
              "ConvDecimalPlace": 3,
              "ActualConv": 1,
              "ActualBaseConv": 1,
              "SubUOM": [
                {
                  "uom_node_id": {
                    "type": "node",
                    "schema": "dbo",
                    "table": "UOM",
                    "id": 0
                  },
                  "UOMUID": 1,
                  "UOM": "Nos",
                  "Conv": 1,
                  "DecimalPlace": 3,
                  "ActualConv": 1,
                  "ActualBaseConv": 1,
                  "ConvDecimalPlace": 3,
                  "IsDefault": true,
                  "IsActive": true
                }
              ],
              "IsDefault": true,
              "IsActive": true
            }
          ],
          "IsActive": true,
          "ShelfLife": 0,
          "StandardPrice": null,
          "IsBatchManagement": false,
          "ROL": 0,
          "MOQ": 0,
          "MaximumOrderQty": 0,
          "ShortName": "",
          "QtyTolerance": 0,
          "TableLog": [
            "C2022-09-08 13:01:46:86",
            "M2022-09-08 13:01:46:86"
          ],
          "ItemType": "NormalItem",
          "PrinciplePartNo": "",
          "DrawingNo": "",
          "Location": "",
          "IsSerialNoEnabled": false,
          "IsSingleSerialNo": false,
          "IsFIFOStrictItem": false,
          "IsZReportAccountPosting": false,
          "MaterialWeight": null,
          "isPDIR": null,
          "PDIR": null,
          "MSTS": null,
          "MSDS": null,
          "TESTCOIN": null,
          "isOnsite": null,
          "IsProductionItem": false,
          "Ucode": null,
          "PrepartionTime": null,
          "RefUID": null,
          "LeadDays": 0,
          "Tolerance": 0,
          "WastagePercentage": 0
        },
        "_DineGroupValue": [
          {
            "vAttributeValue": "Drinks"
          }
        ],
        "_FoodTypeValue": [],
        "_SubDineGroupValue": [],
        "TotalNumRecords": 407,
        "UOM": "Nos",
        "UOM_node_id": {
          "type": "node",
          "schema": "dbo",
          "table": "UOM",
          "id": 0
        },
        "UOMUID": 1,
        "CommodityCode": "VAT5%Commodity",
        "CommodityDescription": "VAT@5%",
        "CommodityType": "VAT",
        "CommodityPercentage": 5,
        "_ItemGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 196
        },
        "ItemGroup": "BEVARAGES MENU",
        "_ItemSubGroupNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemType",
          "id": 422
        },
        "_DineGroupNodeIDList": [
          {
            "AttributeNodeID": {
              "type": "node",
              "schema": "dbo",
              "table": "Attributes",
              "id": 2342
            }
          }
        ],
        "IsAddon": false,
        "ItemSubGroup": "Drinks",
        "QOH": 0,
        "ItemCategory": "FOOD ITEMS",
        "_ItemCategoryNodeid": {
          "type": "node",
          "schema": "dbo",
          "table": "ItemCategory",
          "id": 101
        },
        "_ItemMedia": [],
        "IsUsedBOM": 1,
        "WH_Template_node_id": null,
        "ItemLocationDetails": null,
        "_ProjectTaskDetails": {
          "_ProjectTask_node_id": {
            "type": "node",
            "schema": "dbo",
            "table": "ProjectTask",
            "id": 19094
          },
          "TaskID": 19095,
          "TaskTitle": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskDetail": "Default Item Template Dated May  9 2024 12:51PM",
          "TaskStatusUID": 12,
          "StatusUID": 12,
          "StatusDescription": "Draft",
          "StatusColor": "#907f7e",
          "IsComplete": false
        },
        "ListItemAttributeDetail": [],
        "IsTransactionsItems": true,
        "UnitCode": null,
        "IsProductionItem": false
      }
    ]
    return aItemDetails
  }
}
