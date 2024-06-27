import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class ScreenConfigService {

    @Output() ScreenTypeEmiter: EventEmitter<number> = new EventEmitter();
    mLogUserDetails: any = null;

    constructor() {
    }

    SetScreenType(pScreenType: number) {
        this.ScreenTypeEmiter.emit(pScreenType);
    }

    GetScreenType() {
        return this.ScreenTypeEmiter;
    }

    OnAssignLogUserDetails(pValue) {
        this.mLogUserDetails = {} as any;
        this.mLogUserDetails = pValue;
    }

}