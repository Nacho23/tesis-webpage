import { Component } from '@angular/core';
import { NoticeService } from '../../services/notice/notice.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  templateUrl: 'details-alert.component.html'
})
export class DetailsAlertsComponent {
  public alertDetails: any;
  public profileTarget: any;
  public profileSender: any;

  constructor(private noticeService: NoticeService, private route: ActivatedRoute,
    private profileService: ProfileService) { 
    this.route.params.subscribe(params => {
      const _uid = params['uid'];
      this.noticeService.getAlertByUid(_uid).on('value', snap => {
        this.alertDetails = snap.val();
        this.alertDetails.uid = snap.key;
        if (this.alertDetails.sender != null) {
          this.profileService.getUserProfileByUid(this.alertDetails.sender).on('value', snapProfile => {
            this.profileSender = snapProfile.val();
            this.profileSender.uid = snapProfile.key;
            this.alertDetails.senderName = snapProfile.val().firstName + ' ' + snapProfile.val().lastName;
          })
        }
        this.profileService.getUserProfileByUid(this.alertDetails.target).on('value', snapProfile => {
          this.profileTarget = snapProfile.val();
          this.profileTarget.uid = snapProfile.key;
          this.alertDetails.targetName = snapProfile.val().firstName + ' ' + snapProfile.val().lastName;
        })
      })
    })
  }

  changeStatus(status) {
    this.noticeService.changeStatusAlert(this.alertDetails.uid, status);
  }

  seePhone() {
    alert("Tel:" + this.profileTarget.phone);
  }

  sendMail() {
    console.log("mail: " + this.profileTarget.email);
  }

}
