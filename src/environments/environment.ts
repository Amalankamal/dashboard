// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://restonew.azurewebsites.net',
  
  App_Version: "1.0.1.0_15-Nov-2021",
  firebaseConfig: {
    apiKey: "AIzaSyACM8gX1d-mEt-eEXgcMrDbovzTkv3JLpY",
    authDomain: "basicapp-953ab.firebaseapp.com",
    databaseURL: "https://basicapp-953ab.firebaseio.com",
    projectId: "basicapp-953ab",
    storageBucket: "basicapp-953ab.appspot.com",
    messagingSenderId: "910839022794",
    appId: "1:910839022794:web:bbb427be1b5c3b6f3d2033",
    measurementId: "G-TTLEKYQ45P"
  },
  brokerhostname: '192.168.0.28',
  brokerportno: 443,
  EasyRestoWebConnection: "http://localhost:9292",
  EasyRestoDashboardConnection: "http://localhost:5321",
  subscriptionUrl: 'https://waesubscribeuat.azurewebsites.net/',
  IsMobile: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
