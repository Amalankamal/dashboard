import { Component, OnInit } from '@angular/core';
import { DISPLAY_TYPE, SCREEN_TYPE } from './common/enumerator/commonenum';
import { ScreenConfigService } from './common/service/screen_config.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  mScreenType: number = SCREEN_TYPE.LOGIN;
  mDisplayType: number = DISPLAY_TYPE.NONE;

  constructor(private cScreenConfigService: ScreenConfigService) {
    this.SetVisibilityBasedOnScreenType();
    this.cScreenConfigService.GetScreenType().subscribe(aScreenType => {
      this.mScreenType = aScreenType;
      this.SetVisibilityBasedOnScreenType();
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  SetVisibilityBasedOnScreenType() {
    if (this.mScreenType == SCREEN_TYPE.LOGIN) {
      this.mDisplayType = DISPLAY_TYPE.NONE;
    }
    else if (this.mScreenType == SCREEN_TYPE.HOME) {
      this.mDisplayType = DISPLAY_TYPE.HEADER_AND_FOOTER_ONLY;
    }
    else {
      this.mDisplayType = DISPLAY_TYPE.HEADER_ONLY
    }
  }

}
