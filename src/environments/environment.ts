// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAsHKfeH3DKKzlwW-a7XhXi1mBnM0qakN8',
    authDomain: 'pwa-notes-74b9f.firebaseapp.com',
    databaseURL: 'https://pwa-notes-74b9f.firebaseio.com',
    projectId: 'pwa-notes-74b9f',
    storageBucket: '',
    messagingSenderId: '150011376416'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
