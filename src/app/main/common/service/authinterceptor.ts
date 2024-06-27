import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
    HttpResponse, HttpUserEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
// import 'rxjs/add/operator/do';
import { tap } from 'rxjs/operators';
import { EncryptSessionService } from './encryptsession.service';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private cRouter: Router, private cEncryptSessionService: EncryptSessionService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        let authReq = req;
        // req.headers.set('Access-Control-Allow-Origin','*');
        if (req.headers.get('No-Auth') == "True") return next.handle(req.clone());
        if (this.cEncryptSessionService.GetTaskManagementAPIAccessKey() != null) {
            authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.cEncryptSessionService.GetTaskManagementAPIAccessKey().access_token) });
        }
        return next.handle(authReq).pipe(tap(
            (succ: any) => { },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.cRouter.navigate(['restodashboardlogin/#']);
                    }
                }
            }
        ));
    }

}