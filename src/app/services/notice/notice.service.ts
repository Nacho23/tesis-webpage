import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor() { }

  addNotice() {
    return firebase.database().ref('/notices/').push({'text': 'Texto Inicial'});
  }

  getNotice() {
    return firebase.database().ref('notices');
  }

  changeStatus(uid: string, status: string) {
    return firebase.database().ref('/notices/' + uid + '/').update({'status': status});
  }

  changeText(uid: string, text: string) {
    return firebase.database().ref('/notices/' + uid + '/').update({'text': text});
  }

  changeDate(uid: string, date: string) {
    return firebase.database().ref('/notices/' + uid + '/').update({'date': date});
  }

  deleteNotice(noticeUid: string) {
    return firebase.database().ref('/notices/' + noticeUid).remove()
    .then(res => {
      console.log("Borrado Exitosamente");
    })
    .catch(err => {
      console.log("Error: " + err.message);
    });
  }

  //ALERTS
  getAlert() {
    return firebase.database().ref('alerts');
  }

  getAlertByUid(uid: string) {
    return firebase.database().ref('alerts/' + uid);
  }

  changeStatusAlert(uid: string, status: string) {
    return firebase.database().ref('/alerts/' + uid + '/').update({'status': status});
  }
}
