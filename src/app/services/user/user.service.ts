import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Reference } from '@firebase/database-types';
import { exists } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  // Obtener lista de usuarios
  getUsersList(department: string) {
    return firebase.database().ref('/userProfile/').orderByChild('department').equalTo(department);
  }

  //Crea auth de nuevo usuario
  createUser(rut: string, firstName: string, lastName: string, type: string, email: string, pass: string, year: string, fueAhijado: boolean, department: string) {
    let createUser = firebase.functions().httpsCallable('createUser');
    createUser({ email: email, pass: pass }).then(result => {
      if (result.data.error != undefined && result.data.error.errorInfo.message == "The email address is already in use by another account.") {
        let user = firebase.functions().httpsCallable('getUserByEmail');
        console.log(email);
        user({ email }).then(result => {
          console.log(result);
          return firebase.database().ref('/userProfile/' + result.data.uid).update({ type: type })
        })
      } else {
        console.log("CORRECTO");
        return firebase.database().ref('/userProfile/' + result.data.uid)
          .set(
            {
              rut: rut,
              firstName: firstName,
              lastName: lastName,
              email: result.data.email,
              type: type,
              year: year,
              fueAhijado: fueAhijado,
              department: department
            }
          );
      }
    })
  }


  //Borra cuenta del usuario
  deleteUser(uid: string) {
    let deleteUser = firebase.functions().httpsCallable('deleteUser');
    deleteUser({ uid }).then(result => {
      console.log(result);
      return firebase.database().ref('/userProfile/' + uid).remove();
    })
  }

}
