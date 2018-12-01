import { Injectable } from '@angular/core';
import * as coockie from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  private authVar = 'noba1hKs8JGT4+aTSRHQLDhXV5Npqwerwrwerwerwewrwerwerwerwrwe';


  set(user: string, token: string, persistent: boolean): void {
    let authData = {
      'user': user,
      'token': token
    };
    if(persistent) {
      coockie.set('session', JSON.stringify(authData), {expires: 7, path: '/'});
    } else {
      coockie.set('session', JSON.stringify(authData));
    }
    //localStorage.setItem(this.authVar, JSON.stringify(authData));
  }

  remove(): void {
    coockie.remove('session', { path: '/' });
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem(this.authVar)).token;
  }

  getUser(): string {
    //return JSON.parse(localStorage.getItem(this.authVar)).user;
    return coockie.get('session');
  }

  isStored(): boolean {
    return (coockie.get('session') != null);
  }
}
