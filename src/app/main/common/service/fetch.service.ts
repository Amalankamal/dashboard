import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { APIException } from './apiexception';
import { EncryptSessionService } from './encryptsession.service';
import { map } from 'rxjs/operators';
import { APIResponse } from '../../content/contentinterface';


@Injectable()

export class FetchService implements Resolve<any> {

    ServiceResponce: any;

    constructor(private cHttpClient: HttpClient,
        private cAPIException: APIException,
        private cEncryptSessionService: EncryptSessionService) {
    }

    getConnectionString() {
        return this.cHttpClient.get<any>("assets/connection.json").pipe(map(response => response));
    }

    getQueuename() {
        return this.cHttpClient.get<any>("assets/queuename.json").pipe(map(response => response));
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return route.data['path'];
    }

    OnReadConnectionJson(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.cHttpClient.get<any>('assets/connection.json')
                .subscribe(
                    (response: any) => {
                        let aAPIResponse: APIResponse = {} as any;
                        aAPIResponse.ResponseCode = 2000;
                        aAPIResponse.ResponseMessage = "Success";
                        aAPIResponse.ResponseList = response;
                        resolve(aAPIResponse);
                    },
                    (reject: any) => {
                        let aAPIResponse: APIResponse = {} as any;
                        aAPIResponse.ResponseCode = 5000;
                        aAPIResponse.ResponseMessage = "Falied";
                        aAPIResponse.ResponseList = this.cAPIException.Exception_Message(reject);
                        resolve(aAPIResponse);
                    }
                );
        });
    }
    /* OAuth-Section Start */
    GenerateAccessToken(): Promise<any> {
        var userData = "username=admin@eds.in&password=123&grant_type=password";
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'No-Auth': 'True' });
        return new Promise((resolve, reject) => {
            this.cHttpClient.post(environment.baseUrl + '/TaskMangementToken', userData)
                .subscribe((response: any) => {
                    let aAPIResponse: APIResponse = {} as any;
                    aAPIResponse.ResponseCode = 200;
                    aAPIResponse.ResponseMessage = "Success";
                    aAPIResponse.ResponseList = response;
                    resolve(aAPIResponse);
                },
                    (reject: any) => {
                        this.cEncryptSessionService.RemoveTaskManagementAPIAccessKey();
                        resolve(this.cAPIException.Exception_Message(reject));
                    });
        });
    }
    /* OAuth-Section End */

    /*Home Screen Start*/
    GetUserCredentials(pPostData): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cHttpClient.post(environment.baseUrl + '/api/CommonFind/GetUserCredentials', pPostData)
                .subscribe((response: any) => {
                    resolve(response);
                },
                    (reject: any) => {
                        this.ServiceResponce = this.cAPIException.Exception_Message(reject);
                        resolve(this.ServiceResponce);
                    });
        });
    }
    /*Home Screen End*/


    GetAppVersionString(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cHttpClient.post(environment.baseUrl + '/Material/api/GetMasterM/GetVersionM', '')
                .subscribe((response: any) => {
                    resolve(response);
                },
                    (reject: any) => {
                        this.ServiceResponce = this.cAPIException.Exception_Message(reject);
                        resolve(this.ServiceResponce);
                    });
        });
    }


}
