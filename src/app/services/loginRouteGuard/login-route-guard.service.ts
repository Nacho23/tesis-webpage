import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AppStorageService } from '../appStorage/app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRouteGuardService implements CanActivate {

  constructor(private store: AppStorageService) { }

  canActivate() {
    return this.store.isStored();
  }

  canActivateAdministrator() {
    //return this.store.isStored();
    console.log(this.store);
  }
}
