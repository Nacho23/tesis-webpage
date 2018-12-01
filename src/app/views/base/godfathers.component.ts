import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

import { user } from '../../../environments/environment';
import { XlsxToJsonService } from '../../services/xlsx-to-json/xlsx-to-json.service';

@Component({
  templateUrl: 'godfathers.component.html',
  styleUrls: ['baseStyle.component.css']
})
export class GodFathersComponent {
  public currentUser: any;

  public godfatherList: Array<any> = [];
  public modalRef: BsModalRef;

  public email: string;
  public pass: string;
  public repeatPass: string;
  public rut: string;
  public firstName: string;
  public lastName: string;

  public loading: boolean;

  public alert: boolean = false;
  public textAlert: string = "";

  public resultFile: any;

  constructor(private profileService: ProfileService, private router: Router, private modalService: BsModalService,
    private userService: UserService, private xlsxToJsonService: XlsxToJsonService) {

    this.userService.getUsersList(user.departmentUid).on('child_added', snap => {
      let date = new Date();
      if (snap.val().type == 'padrino' && snap.val().year == date.getFullYear()) {
        let godfatherObj = snap.val();
        godfatherObj.id = snap.key;
        this.godfatherList.push(godfatherObj);
      }
      return false;
    })
    this.userService.getUsersList(user.departmentUid).on('child_changed', snap => {
      let date = new Date();
      if (snap.val().type == 'padrino' && snap.val().year == date.getFullYear()) {
        let godfatherObj = snap.val();
        godfatherObj.id = snap.key;
        for (let i = 0; i < this.godfatherList.length; i++) {
          if (this.godfatherList[i].uid == godfatherObj.uid) this.godfatherList[i] = godfatherObj;
        }
      }
      return false;
    })
    this.userService.getUsersList(user.departmentUid).on('child_removed', snap => {
      let date = new Date();
      if (snap.val().type == 'padrino' && snap.val().year == date.getFullYear()) {
        for (let i = 0; i < this.godfatherList.length; i++) {
          if (this.godfatherList[i].uid == snap.key) {
            this.godfatherList.splice(i, 1);
          }
        }
      }
      return false;
    })
  }

  goToUserDetails(id) {
    this.router.navigate(['/base/details-user/', id]);
  }

  openModal(modalName) {
    this.alert = false;
    this.textAlert = "";
    this.rut = this.firstName = this.lastName = this.email = this.pass = this.repeatPass = ""
    this.modalRef = this.modalService.show(modalName);
  }

  handleFile(event) {
    let file = event.target.files[0];
    this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
      this.resultFile = data['sheets'].Hoja1;
      console.log(this.resultFile.length);
      for (let i = 0; i < this.resultFile.length; i++) {
        console.log(this.resultFile[i]);
        let rut = this.resultFile[i].rut;
        let email = this.resultFile[i].email;
        let firstName = this.resultFile[i].firstName;
        let lastName = this.resultFile[i].lastName;
        this.createUserXLSX(rut, firstName, lastName, email);
      }
    })
  }

  createUserXLSX(rut, firstName, lastName, email) {
    this.loading = true;
    let type = "padrino";
    let pass = rut.substr(0, rut.length - 2);
    let date = new Date();
    let year = date.getFullYear().toString();
    let fueAhijado = true;
    let department = user.departmentUid;
    console.log(department);
    new Promise(resolve => {
      this.userService.createUser(rut, firstName, lastName, type, email, pass, year, fueAhijado, department);
      resolve(this.loading = false);
    })
      .catch(error => {
        console.log(error);
      })
  }


  createUser(rut, firstName, lastName, email) {
    this.loading = true;
    let type = "padrino"
    let pass = rut.substr(0, rut.length - 2)
    let date = new Date();
    let year = date.getFullYear().toString();
    let fueAhijado = false;
    let department = this.currentUser.department
    new Promise(resolve => {
      this.userService.createUser(rut, firstName, lastName, type, email, pass, year, fueAhijado, department);
      this.modalRef.hide();
      resolve(this.loading = false);
    })
      .catch(error => {
        console.log(error);
      })
  }

  openFile() {

  }

}
