import { Component } from '@angular/core';
import { navItems } from './../../_nav';
import { AuthService } from '../../services/auth/auth.service';
import { AppStorageService } from '../../services/appStorage/app-storage.service';
import { ProfileService } from '../../services/profile/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  public currentProfile: any;
  public profilePicture: any;

  public messageList;

  constructor(private authService: AuthService, private store: AppStorageService, private profileService: ProfileService,
    private router: Router) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized')
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });

    this.currentProfile = this.profileService.getUserProfileAsync()
      .then(user => {
        user.on('value', snap => {
          this.currentProfile = snap.val();
          this.currentProfile.uid = snap.key;
          this.getPhotoURL(this.currentProfile.uid);

          this.getMessage();
        })
      })
  }

  getPhotoURL(uid) {
    this.profileService.getPhotoURL(uid)
      .then(snap => {
        this.profilePicture = snap;
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

  openMessagePage() {
    this.router.navigate(['/base/messages']);
  }

  logout() {
    this.store.remove();
    this.authService.logout();
  }
}
