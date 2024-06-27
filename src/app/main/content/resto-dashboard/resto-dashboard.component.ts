import { Component, OnInit } from '@angular/core';
import { SCREEN_TYPE } from '../../common/enumerator/commonenum';
import { ScreenConfigService } from '../../common/service/screen_config.service';
import { Subscription } from 'rxjs';
import { EncryptSessionService } from '../../common/service/encryptsession.service';

@Component({
  selector: 'app-resto-dashboard',
  templateUrl: './resto-dashboard.component.html',
  styleUrls: ['./resto-dashboard.component.scss']
})
export class RestoDashboardComponent implements OnInit {
  Subscribe_OnOnMenuChangeEventEmitter: Subscription;
  mScreenName: string = '';

  constructor(private cScreenConfigService: ScreenConfigService,
    private cEncryptSessionService: EncryptSessionService) {
    this.cScreenConfigService.SetScreenType(SCREEN_TYPE.DASHBOARD);
    this.Subscribe_OnOnMenuChangeEventEmitter = this.cEncryptSessionService.Subscribe_OnMenuChangeEventEmitter().subscribe(aMenuName => {
      this.mScreenName = aMenuName;
    });
  }

  ngOnInit() {
    console.log(new Date());
  }

  ngOnDestroy() {
    this.Subscribe_OnOnMenuChangeEventEmitter.unsubscribe();
  }

}
