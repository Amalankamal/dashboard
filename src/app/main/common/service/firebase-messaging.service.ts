import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import firebase from '@firebase/app';
import '@firebase/messaging';
import { environment } from 'src/environments/environment';
import { EncryptSessionService } from './encryptsession.service';
import { DatePipe } from '@angular/common';
import { INotificationDetails } from '../../content/contentinterface';

@Injectable()

export class FireBaseService implements Resolve<any> {

    public NotificationDetails: INotificationDetails[] = [];

    constructor(private cEncryptSessionService: EncryptSessionService,
        private cDatePipe: DatePipe) { }

    InitializeFirebaseConfigDetails() {
        firebase.initializeApp(environment.firebaseConfig);

        const messaging = firebase.messaging();



        messaging.requestPermission()
            .then(function () {
                console.log('Have Permissions');
                return messaging.getToken();
            })
            .then(token => {
                sessionStorage.setItem("SNT", JSON.stringify(token));
            })
            .catch(function (err) {
                console.log('Error Occured');
                console.log("Error : " + err);
            })

        messaging.onMessage(payload => {

            console.log("onMessage : " + JSON.stringify(payload));
            this.SaveMessageInStorage(payload);
        });

        // Callback fired if Instance ID token is updated.
        messaging.onTokenRefresh(function () {
            messaging.getToken()
                .then(refreshedToken => {
                    console.log('Token refreshed.');
                    this.cEncryptSessionService.SaveNotificationToken(refreshedToken);
                })
                .catch(function (err) {
                    console.log('Unable to retrieve refreshed token ', err);
                });
        });

    }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return route.data['path'];
    }

    SaveMessageInStorage(payload) {

        let aNotifications = localStorage.getItem("ND");

        if (aNotifications != null && typeof (aNotifications) != 'undefined') {
            this.NotificationDetails = JSON.parse(aNotifications);
        }
        else {
            this.NotificationDetails = [];
        }

        let aNotificationDetails: INotificationDetails = {} as INotificationDetails;
        aNotificationDetails.Title = payload.notification.title;
        aNotificationDetails.Message = payload.notification.body;
        aNotificationDetails.Time = this.cDatePipe.transform(new Date(), "dd-MMM-yyyy hh:mm a");
        aNotificationDetails.IsRead = false;

        this.NotificationDetails.push(aNotificationDetails);
        localStorage.setItem("ND", JSON.stringify(this.NotificationDetails));
    }

}