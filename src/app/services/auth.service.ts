import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User | null>;

  constructor(
    private _authAngularFire: AngularFireAuth,
    private _angularFireStore: AngularFirestore
  ) {
    this.init();
  }

  init() {
    if (localStorage.getItem('user') !== 'undefined') {

      this.user = this._authAngularFire.authState.pipe(
        switchMap(user => {
          if (user) {
            return this._angularFireStore.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        }),
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
        }),
        startWith(JSON.parse(localStorage.getItem('user')))
      );

    }
  }

  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any) {
    return this._authAngularFire.auth
      .signInWithPopup(provider)
      .then(credential => {
        localStorage.setItem('user', JSON.stringify(credential.user));
        this.init();
        return this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this._angularFireStore.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return userRef.set(data);
  }

  private handleError(error: Error) {
    console.error(error);
  }

  logout() {
    return this._authAngularFire.auth.signOut();
  }

}
