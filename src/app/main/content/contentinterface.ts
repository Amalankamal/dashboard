export interface INodeId {
    type: string;
    schema: string;
    table: string;
    id: number;
}

export interface TokenAccess {
    access_token: string;
    token_type: string;
    expires_in: string
}

export interface IApplicationConfiguration {
    _AppConfig_node_id: INodeId;
    UID: number;
    ConfigName: string;
    Area: string;
    _ConfigDetailsJSON: I_ConfigDetailsJSON
    ConfigValue: string;
}

export interface I_ConfigDetailsJSON {
    DefaultProjectSelectionRequired: boolean;
    DefaultProjectVisible: boolean;
    DefaultProjectName: string;
    DefaultProjectID: number;
    DefaultProject_node_id: INodeId;
    Organisation_node_id: INodeId;
    DefaultValue: number;
    FromDate: string;
    ConfigValue?: number;
    DateDefaultFilter?: any;
}

export interface TokenAccess {
    access_token: string;
    token_type: string;
    expires_in: string
}
export interface APIResponse {
    ResponseCode: number;
    ResponseMessage: string;
    ResponseList: any;
}
export interface INotificationDetails {
    Title: string;
    Message: string;
    Time: string;
    IsRead: boolean;
}

export interface IAPIRequestList {
    APIRequestList: string[];
}
export interface ICustomDatePickerDetails {
    TransactionType_FromDate: Date;
    TransactionType_ToDate: Date;
    PendingTransaction_FromDate: Date;
    PendingTransaction_ToDate: Date;
    IsOKButtonClicked: boolean;
    SelectedOption: string;
    SelectedPendingDocDateOption: string;
    IsPendingDateChange: boolean;
}
export interface ICustomDatePickerPopoverStyle {
    PopoverOffsetX: number;
    PopoverOffsetY: number;
    PopoverArrowOffsetX: number;
    PopoverArrowOffsetY: number;
}