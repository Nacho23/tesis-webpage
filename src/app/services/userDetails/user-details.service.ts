import { Injectable } from '@angular/core';
import { Reference } from '@firebase/database-types';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor() { }

  getHistories(uid: string): Reference {
    return firebase.database().ref('/userProfile/' + uid + '/histories/');
  }

  getGodfathers(department: string) {
    return firebase.database().ref('/userProfile/').orderByChild('department').equalTo(department);
  }

  updateGodfther(userUid, godfatherUid) {
    return firebase.database().ref('/userProfile/' + userUid + '/').update({godfatherId: godfatherUid});
  }

  changeFirstName(userUid, firstName) {
    return firebase.database().ref('/userProfile/' + userUid + '/').update({firstName: firstName});
  }

  changeLastName(userUid, lastName) {
    return firebase.database().ref('/userProfile/' + userUid + '/').update({lastName: lastName});
  }

  changeBirthDate(userUid, birthDate) {
    return firebase.database().ref('/userProfile/' + userUid + '/').update({birthDate: birthDate});
  }

  changePhone(userUid, phone) {
    return firebase.database().ref('/userProfile/' + userUid + '/').update({phone: phone});
  }

  changeRut(userUid, rut) {
    return firebase.database().ref('/userProfile/' + userUid + '/').update({rut: rut});
  }
}
