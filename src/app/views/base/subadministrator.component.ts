import { Component } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdministratorService } from '../../services/administrator/administrator.service';
import { UserService } from '../../services/user/user.service';

@Component({
  templateUrl: 'subadministrator.component.html'
})
export class SubadministratorComponent {
  public subadministratorList: Array<any> = [];
  public modalRef: BsModalRef;

  public uid: string;
  public email: string;
  public rut: string;
  public firstName: string;
  public lastName: string;

  public action: string = "create";
  public btnUserAction: string = "Crear Encargado";

  public alert: string = "empty";
  public textAlert: string = "";

  public alertModal: boolean = false;
  public textAlertModal: string = "";
  public loading: boolean;

  constructor(private modalService: BsModalService, private administratorService: AdministratorService,
    private userService: UserService) {
    this.administratorService.getSubadministrators().on('child_added', snap => {
      let subadministratorObj = snap.val();
      subadministratorObj.uid = snap.key;
      this.subadministratorList.push(subadministratorObj);
    })
    this.administratorService.getSubadministrators().on('child_changed', snap => {
      let subadministratorObj = snap.val();
      subadministratorObj.uid = snap.key;
      for (let i = 0; i < this.subadministratorList.length; i++) {
        if (this.subadministratorList[i].uid == subadministratorObj.uid) this.subadministratorList[i] = subadministratorObj;
      }
    })
    this.administratorService.getSubadministrators().on('child_removed', snap => {
      for (let i = 0; i < this.subadministratorList.length; i++) {
        if (this.subadministratorList[i].uid == snap.key) {
          this.subadministratorList.splice(i, 1);
        }
      }
    })
  }


  openModalUser(modalName) {
    this.alertModal = false;
    this.textAlertModal = "";
    this.action = "create";
    this.btnUserAction = "Crear Encargado";
    this.rut = this.firstName = this.lastName = this.email = this.rut = "";
    this.modalRef = this.modalService.show(modalName);
  }

  openModalUserWithParams(modalName, uid) {
    this.administratorService.getSubadministratorByUid(uid).on('value', snap => {
      this.action = "edit";
      this.alertModal = false;
      this.firstName = snap.val().firstName;
      this.lastName = snap.val().lastName;
      this.uid = snap.key;
      this.rut = snap.val().rut;
      this.email = snap.val().email;
      this.btnUserAction = "Editar Encargado";
      this.modalRef = this.modalService.show(modalName);
    })
    error => {
      console.log(error);
    }
  }

  createUser(firstName, lastName, rut, email) {
    if (this.action == "create") {
      this.loading = true;
      let pass = rut.substr(0, rut.length - 2)
      console.log("CREA");
      new Promise(resolve => {
        this.administratorService.createUser(firstName, lastName, rut, email, pass);
        this.modalRef.hide();
        this.textAlert = "Creado Correctamente";
        resolve(this.loading = false);
      })
    } else if (this.action == "edit") {
      console.log("EDITA");
      new Promise(resolve => {
        this.administratorService.updateUser(firstName, lastName, rut, email, this.uid);
        this.modalRef.hide();
        resolve(this.loading = false);
      })
    }
  }

  removeSubadministrator(uid) {
    this.loading = true;
    var result = confirm("Seguro desea eliminar el usuario?");
    if (result) {
      new Promise(resolve => {
        this.userService.deleteUser(uid);
        resolve(this.loading = false)
      })
      this.alert = "success";
      this.textAlert = "Eliminado Correctamente";
    }
    else {
      console.log("Cancelar");
      this.loading = false;
    }
  }
}
