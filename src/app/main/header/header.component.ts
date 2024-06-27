import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SCREEN_TYPE } from '../common/enumerator/commonenum';
import { ScreenConfigService } from '../common/service/screen_config.service';
import { EncryptSessionService } from '../common/service/encryptsession.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  mPageTitile: string = '';
  mCurrentDate = new Date();
  mResourceName: string = 'Demo VAT HO Admin';

  constructor(private cRouter: Router, private cScreenConfigService: ScreenConfigService,
    private cEncryptSessionService: EncryptSessionService,
  ) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  LogOutClick() {
    let aSessionData = this.cEncryptSessionService.GetLogUserDetails();
    if (aSessionData != null && aSessionData != undefined) {
      window.location.href = aSessionData.origin;
      window.location.assign(aSessionData.origin);
    }
    else {
      this.cScreenConfigService.SetScreenType(SCREEN_TYPE.LOGIN);
      this.cRouter.navigate(['./restodashboardlogin/#']);
    }
  }

  ngOnDestroy() { }
}
