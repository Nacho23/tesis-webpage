import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  templateUrl: 'messages.component.html'
})
export class MessagesComponent {

  public currentProfile: any;

  public messageList: Array<any>;


  constructor(private profileService: ProfileService) { 
    this.currentProfile = this.profileService.getUserProfileAsync()
    .then(user => {
      user.on('value', snap => {
        this.currentProfile = snap.val();
        this.currentProfile.uid = snap.key;
        this.getMessage();
      })
    })
  }

  getMessage() {
    this.profileService.getMessages().orderByChild('addressee').equalTo(this.currentProfile.department).on('value', snapList => {
      this.messageList = [];
      snapList.forEach(snap => {
        let messageObj = snap.val();
        messageObj.uid = snap.key;
        console.log(messageObj);
        this.profileService.getUserProfileByUid(messageObj.sender).on('value', snapProfile => {
          messageObj.senderName = snapProfile.val().firstName + ' ' + snapProfile.val().lastName;
          this.messageList.push(messageObj);
        })
        return false;
      });
    })
  }
}
