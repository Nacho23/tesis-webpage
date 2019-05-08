import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import * as coockie from 'js-cookie';

import { ProfileService } from '../profile/profile.service';
import { AppStorageService } from '../appStorage/app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false;
  user: any;

  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private profileService: ProfileService,
    private appStorage: AppStorageService) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        //Usuario logeado        
        this.profileService.getUserProfileByUid(user.uid).once('value')
          .then(snapShot => {
            let type = snapShot.val().type;
            if (type == "subadministrator" || type == "administrator") {
              console.log("Acceso");
              this.user = user;
              this.isLoggedIn = true;
              this.router.navigate(['/dashboard'])
            }
          })
      }
      else {
        //Usuario no logeado
        this.user = {};
        this.router.navigate(['/'])
        this.isLoggedIn = false;
      }
    });
  }

  login(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signInWithEmailAndPassword(user.user, user.pass)
        .then(res => {
          this.isLoggedIn = true;
          resolve(res);
        })
        .catch(err => {
          this.isLoggedIn = false;
          reject(err);
        })
    })
  }

  /*loginUser(email:string, password:string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function() {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(authData => {
          resolve(authData);
          this.isLoggedIn = true;
        })
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.isLoggedIn = false;
      })
    });
  }*/

  resetPassword(email: string): Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logout() {
    coockie.remove('session', { path: '/' });
    const userId: string = firebase.auth().currentUser.uid;
    console.log(userId);
    firebase.database().ref(`/userProfile/${userId}`).off();
    firebase.auth().signOut().then((res) => this.router.navigate(['/']));
  }
}
