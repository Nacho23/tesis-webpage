import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Reference } from '@firebase/database-types';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public currentUser: firebase.User;
  public currentProfile: firebase.database.Reference;
  public usersListRef: Reference;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        //this.currentProfile = firebase.database().ref('/userProfile/' + user.uid);
      }
    })
  }

  // Obtener imagen de perfil de usuario
  getPhotoURL(uid): Promise<any> {
    return new Promise(resolve => {
      firebase.storage().ref('profilePictures/' + uid + '.png').getDownloadURL().then((url) => {
        resolve(url);
      })
        .catch(error => {
          firebase.storage().ref('profilePictures/user.png').getDownloadURL().then((url) => {
            resolve(url);
          })
        })
    })

  }

  // Obtener cuenta del usuario uid:parametro
  getUserProfileByUid(uid) {
    return firebase.database().ref('/userProfile/' + uid);
  }

  // Obtener cuenta del usuario actual
  getUser() {
    return this.currentUser;
  }

  //Obtener perfil del usuario actual
  getUserProfileAsync(): Promise<any> {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.currentUser = user;
          this.currentProfile = firebase.database().ref('/userProfile/' + user.uid);
          resolve(this.currentProfile);
        }
      });
    })
  }

  getMessages() {
    return firebase.database().ref('/messages/');
  }
}
