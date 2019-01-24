import { Component } from '@angular/core';
import { NoticeService } from '../../services/notice/notice.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { UserService } from '../../services/user/user.service';
import { user } from '../../../environments/environment';


@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

  public noticesList = [];
  public alertsList = [];
  public image: any;

  public godfatherList: Array<any> = [];
  public godsonList: Array<any> = [];
  public countGodfather: number = 0;
  public countGodson: number = 0;

  constructor(public noticeService: NoticeService, public profileService: ProfileService,
    private router: Router, private userService: UserService) {
    this.profileService.getUserProfileByUid(localStorage.getItem('userUid')).once('value', snap => {
      user.departmentUid = snap.val().department;
      this.countUsers();
    })

    this.createList(this.noticesList);
    this.createListAlerts(this.alertsList);
  }

  createList(list) {
    //list.length = 0;
    this.noticeService.getNotice().on("child_added", snapChild => {
      let noticeObject = snapChild.val();
      noticeObject.options = [];
      noticeObject.uid = snapChild.key;
      this.image = noticeObject.status;
      list.push(noticeObject);
    });
  }

  createListAlerts(list) {
    //list.length = 0;
    this.noticeService.getAlert().on("child_added", snapChild => {
      let alertsObject = snapChild.val();
      alertsObject.options = [];
      alertsObject.uid = snapChild.key;
      //this.image = alertsObject.status;     
      if (alertsObject.sender != null) {
        this.profileService.getUserProfileByUid(alertsObject.sender).on('value', snapProfile => {
          alertsObject.senderName = snapProfile.val().firstName + ' ' + snapProfile.val().lastName;
        })
      }
      this.profileService.getUserProfileByUid(alertsObject.target).on('value', snapProfile => {
        alertsObject.targetName = snapProfile.val().firstName + ' ' + snapProfile.val().lastName;
      })
      list.push(alertsObject);
    });
  }

  countUsers() {
    this.userService.getUsersList(user.departmentUid).on('value', snapshot => {
      let date = new Date();
      snapshot.forEach(snap => {
        if (snap.val().type == 'padrino' && snap.val().year == date.getFullYear()) {
          let godfatherObject = snap.val();
          godfatherObject.id = snap.key;
          this.godfatherList.push(godfatherObject);
          this.countGodfather += 1;
        }
        return false;
      });
    });

    this.userService.getUsersList(user.departmentUid.toString()).on('value', snapshot => {
      let date = new Date();
      snapshot.forEach(snap => {
        if (snap.val().type == 'ahijado' && snap.val().year == date.getFullYear()) {
          let godsonObject = snap.val();
          godsonObject.id = snap.key;
          this.godsonList.push(godsonObject);
          this.countGodson += 1;
        }
        return false;
      });
    });
  }

  goToAlertDetails(uid) {
    this.router.navigate(['/base/details-alert/', uid]);
  }

}
