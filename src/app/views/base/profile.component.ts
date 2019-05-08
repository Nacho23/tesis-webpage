import { Component } from '@angular/core';


import { ProfileService } from '../../services/profile/profile.service';

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['baseStyle.component.css']
})
export class ProfileComponent {
    public currentProfile: any;
    public profilePicture: any;

    constructor(private profileService: ProfileService) {
        this.currentProfile = this.profileService.getUserProfileAsync()
            .then(user => {
                user.on('value', snap => {
                    this.currentProfile = snap.val();
                    this.currentProfile.uid = snap.key;
                    this.getPhotoURL(this.currentProfile.uid);
                })
            })
    }

    getPhotoURL(uid) {
        this.profileService.getPhotoURL(uid)
            .then(snap => {
                console.log("LOGRADO");
                this.profilePicture = snap;
            })
    }
}
