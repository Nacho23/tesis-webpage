import { Component } from '@angular/core';
import { NoticeService } from '../../services/notice/notice.service';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'notice.component.html'
})
export class NoticeComponent {

  public noticesList = [];

  public image: any;
  /*public noticesList = [
    {id: 1, text: "Cierre postulaciones"},
    {id: 2, text: "Cierre postulaciones segunda etapa"}
  ]*/

  constructor(private noticeService: NoticeService) {
    this.createList(this.noticesList);
  }

  createList(list) {
    list.length = 0;
    this.noticeService.getNotice().on("child_added", snapChild => {
      let noticeObject = snapChild.val();
      noticeObject.options = [];
      noticeObject.uid = snapChild.key;      
      this.image = noticeObject.status;
      list.push(noticeObject);
    });
    this.noticeService.getNotice().on("child_changed", snapChild => {
      let noticeObject = snapChild.val();
      noticeObject.options = [];
      noticeObject.uid = snapChild.key;
      this.image = noticeObject.status;
      for (let i = 0; i < list.length; i++) {
        if (list[i].uid == noticeObject.uid) list[i] = noticeObject;
      }
    });
  }

  addNotice() {
    this.noticeService.addNotice();
  }

  changeStatus(uid, status) {
    this.noticeService.changeStatus(uid, status);
    if(status == 'active'){
      this.image = 'active';
    } else if (status == 'inactive'){
      this.image = 'inactive';
    }
  }

  changeText(uid, text) {
    this.noticeService.changeText(uid, text);
  }

  changeDate(uid, date) {
    this.noticeService.changeDate(uid, date);
  }

  deleteNotice(uid) {
    var result = confirm("Seguro desea eliminar la pregunta?");
    if (result) {
      this.noticeService.deleteNotice(uid);
      this.createList(this.noticesList);
    }
    else {
      console.log("Cancelar");
    }
  }

}
