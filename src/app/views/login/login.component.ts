import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../../validators/email';
import * as firebase from 'firebase';

// Import Services
import { AuthService } from '../../services/auth/auth.service';
import { ProfileService } from '../../services/profile/profile.service';
import { AppStorageService } from '../../services/appStorage/app-storage.service';
import { user } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  public loginForm: FormGroup;

  public user = {
    user: '',
    pass: ''
  };

  errorLogin: boolean = false

  constructor(private formbuilder: FormBuilder, private authService: AuthService,
    private profileService: ProfileService, private router: Router, private store: AppStorageService) {
    this.loginForm = formbuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      sesion: false
    });
  }

  login() {
    this.user = {
      user: this.loginForm.value.email,
      pass: this.loginForm.value.password
    };
    this.authService.login(this.user)
      .then((res) => {
        console.log("Usuario Registrado");
        this.store.set(res.user.email, res.user.uid, this.loginForm.value.sesion);
        user.userUid = res.user.uid;
        this.router.navigate(['/dashboard'])
        this.errorLogin = false;
      }, err => {
        alert(err.message);
        console.log("Usuario NO registrado");
        this.router.navigate(['/']);
        this.errorLogin = true;
      })
  }


  /*login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.loginUser(email, password)
      .then(authData => {
        console.log(authData.user.uid);
        this.profileService.getUserProfileByUid(authData.user.uid).once('value')
          .then(snapShot => {
            console.log(snapShot.val());
            let type = snapShot.val().type;
            if (type == "padrino") {
              alert("No tiene permisos");
            } else if (type == "ahijado") {
              alert("No tiene permisos");
            } else {
              this.router.navigate(['dashboard']);
              console.log("Acceso");
            }
          })
      },
        error => {
          alert(error.message);
        });
  }*/
}
