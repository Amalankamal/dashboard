import { Component, } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FetchService } from './main/common/service/fetch.service';
import { EncryptSessionService } from './main/common/service/encryptsession.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'restoweb-dashboard';
  mGetConnection_Subscription: Subscription;

  constructor(private cFetchService: FetchService, private cEncryptSessionService: EncryptSessionService) {

  }

  ngOnInit() {
    if (environment.production) {
      this.mGetConnection_Subscription = this.cFetchService.getConnectionString().subscribe(aConnection => {
        environment.baseUrl = aConnection.WorkAtEazeConnection;
        console.log("Base URL : " + environment.baseUrl);
        console.log("Sources loaded: " + new Date());
      });
    }
    else {
      console.log("Base URL : " + environment.baseUrl);
      console.log("Sources loaded: " + new Date());
    }
    this.onGenerateTokenForAuthorisation();
  }
  onGenerateTokenForAuthorisation() {

    var aUpdatedata = this.cFetchService.GenerateAccessToken();
    aUpdatedata.then((Resultdata) => {
      if (Resultdata.ResponseCode == 200) {
        this.cEncryptSessionService.SetTaskManagementAPIAccessKey(Resultdata.ResponseList);
      }
      else {
        this.cEncryptSessionService.MessageDialog("Message", Resultdata, false, true);
      }
    });
  }


}
