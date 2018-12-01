import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as firebase from 'firebase';
import { environment, user } from '../environments/environment';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {
    firebase.initializeApp(environment.firebase);
  }

  ngOnInit() {
    const unsubscribe = firebase.auth().onAuthStateChanged(snap => {
      if(!snap){
        console.log("No hay sesion inicada");
        this.router.navigate(['/']);
        unsubscribe();
      } else {
        user.userUid = snap.uid;
        localStorage.setItem('userUid', snap.uid);
        this.router.navigate(['/dashboard']);
        unsubscribe()
      }
    })
    /*this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });*/
  }
}
