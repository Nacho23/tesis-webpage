import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AppStorageService } from '../appStorage/app-storage.service';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AdministratorRouteGuardService implements CanActivate {

  constructor(private store: AppStorageService, private profileService: ProfileService) { }

  canActivate() {
    let result = false;
    //return this.store.isStored();
    let user = JSON.parse(this.store.getUser());
    console.log(user.token);
    this.profileService.getUserProfileByUid(user.token).on('value', snap => {
      let type = snap.val().type;
      if(type == "administrator"){
        result = true;
      } else {
        alert("No tiene permisos para esta función");
        result = false;
      }
    })
    return result;
  }


}
