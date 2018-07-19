import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent, AppBottomSheet, AppDialogOverview } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MomentModule } from 'angular2-moment';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialAngular } from './material-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessagingService } from './services/messaging.service';

@NgModule({
  declarations: [
    AppComponent,
    AppBottomSheet,
    AppDialogOverview
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MaterialAngular,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FormsModule,
    MomentModule,
    HttpClientModule
  ],
  providers: [
    MessagingService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppBottomSheet,
    AppDialogOverview
  ]
})
export class AppModule { }
