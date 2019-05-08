import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import * as xlsxjs from 'xlsx';
import { UserService } from '../../services/user/user.service';

import { user } from '../../../environments/environment';
import { XlsxToJsonService } from '../../services/xlsx-to-json/xlsx-to-json.service';

@Component({
  templateUrl: 'godsons.component.html',
  styleUrls: ['baseStyle.component.css']
})
export class GodSonsComponent {
  public currentUser: any;

  public arrayEmpty: boolean = false;

  public godsonList: Array<any> = [];
  public modalRef: BsModalRef;

  public email: string;
  public pass: string;
  public repeatPass: string;
  public rut: string;
  public firstName: string;
  public lastName: string;
  public file: string;

  public loading: boolean;

  public alert: boolean = false;
  public textAlert: string = "";

  public resultFile: any;

  constructor(private router: Router, private modalService: BsModalService,
    private userService: UserService, private xlsxToJsonService: XlsxToJsonService) {

    this.userService.getUsersList(user.departmentUid).on('child_added', snap => {
      let date = new Date();
      if (snap.val().type == 'ahijado' && snap.val().year == date.getFullYear()) {
        let godsonObj = snap.val();
        godsonObj.id = snap.key;
        this.godsonList.push(godsonObj);
      }
      return false;
    })
    this.userService.getUsersList(user.departmentUid).on('child_changed', snap => {
      let date = new Date();
      if (snap.val().type == 'padrino' && snap.val().year == date.getFullYear()) {
        let godsonObj = snap.val();
        godsonObj.id = snap.key;
        for (let i = 0; i < this.godsonList.length; i++) {
          if (this.godsonList[i].uid == godsonObj.uid) this.godsonList[i] = godsonObj;
        }
      }
      return false;
    })
    this.userService.getUsersList(user.departmentUid).on('child_removed', snap => {
      let date = new Date();
      if (snap.val().type == 'padrino' && snap.val().year == date.getFullYear()) {
        for (let i = 0; i < this.godsonList.length; i++) {
          if (this.godsonList[i].uid == snap.key) {
            this.godsonList.splice(i, 1);
          }
        }
      }
      return false;
    })
    if(this.godsonList.length == 0) {
      this.arrayEmpty = true;
    }
  }

  goToUserDetails(id) {
    this.router.navigate(['/base/details-user/', id]);
  }

  handleFile(event) {
    let file = event.target.files[0];
    this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
      this.resultFile = data['sheets'].Hoja1;
      for (let i = 0; i < this.resultFile.length; i++) {
        let rut = this.resultFile[i].rut;
        let email = this.resultFile[i].email;
        let firstName = this.resultFile[i].firstName;
        let lastName = this.resultFile[i].lastName;
        this.createUserXLSX(rut, firstName, lastName, email);
      }
    })
  }

  openModal(modalName) {
    this.alert = false;
    this.textAlert = "";
    this.rut = this.firstName = this.lastName = this.email = this.pass = this.repeatPass = ""
    this.modalRef = this.modalService.show(modalName);
  }

  createUserXLSX(rut, firstName, lastName, email) {
    this.loading = true;
    let type = "ahijado";
    let pass = rut.substr(0, rut.length - 2);
    let date = new Date();
    let year = date.getFullYear().toString();
    let fueAhijado = true;
    let department = user.departmentUid;
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
    let type = "ahijado";
    let pass = rut.substr(0, rut.length - 2);
    let date = new Date();
    let year = date.getFullYear().toString();
    let fueAhijado = true;
    let department = user.departmentUid;
    console.log(department);
    new Promise(resolve => {
      this.userService.createUser(rut, firstName, lastName, type, email, pass, year, fueAhijado, department);
      this.modalRef.hide();
      resolve(this.loading = false);
    })
      .catch(error => {
        console.log(error);
      })
  }
}
