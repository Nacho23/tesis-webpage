import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdministratorService } from '../../services/administrator/administrator.service';

@Component({
  templateUrl: 'department.component.html'
})
export class DepartmentComponent {
  public departmentList: Array<any> = [];
  public subadministratorList: Array<any> = [];
  public modalRef: BsModalRef;

  public uid: string;
  public email: string;
  public rut: string;
  public firstName: string;
  public lastName: string;
  public code: string;
  public nameDepartment: string;
  public subadministrator: string;

  public action: string = "create";
  public btnAction: string = "Crear Unidad";
  public btnUserAction: string = "Crear Encargado";

  public alert: string = "empty";
  public textAlert: string = "";

  public alertModal: boolean = false;
  public textAlertModal: string = "";
  public loading: boolean;

  constructor(private modalService: BsModalService, private administratorService: AdministratorService) {
    this.subadministrator = "0";
    this.administratorService.getDepartments().on('child_added', snap => {
      let departmentObj = snap.val();
      departmentObj.uid = snap.key;
      this.administratorService.getSubadministratorByUid(departmentObj.subadministrator).on('value', snap => {
        if (snap.val() == null) {
          departmentObj.nameSubadministrator = "No existe encargado asignado";
          this.departmentList.push(departmentObj);
        } else {
          departmentObj.nameSubadministrator = snap.val().firstName + " " + snap.val().lastName;
          this.departmentList.push(departmentObj);
        }
      })
    })
    this.administratorService.getDepartments().on('child_changed', snap => {
      let departmentObj = snap.val();
      departmentObj.uid = snap.key;
      for (let i = 0; i < this.departmentList.length; i++) {
        if (this.departmentList[i].uid == departmentObj.uid) this.departmentList[i] = departmentObj;
      }
      for (let i = 0; i < this.departmentList.length; i++) {
        this.administratorService.getSubadministratorByUid(this.departmentList[i].subadministrator).on('value', snap => {
          if (snap.val() == null) {
            this.departmentList[i].nameSubadministrator = "No existe encargado asignado";
          } else {
            this.departmentList[i].nameSubadministrator = snap.val().firstName + " " + snap.val().lastName;
          }
        })
      }
    })
    this.administratorService.getDepartments().on('child_removed', snap => {
      for (let i = 0; i < this.departmentList.length; i++) {
        if (this.departmentList[i].uid == snap.key) {
          this.departmentList.splice(i, 1);
        }
      }
    })
  }

  getSubadministrators() {
    this.administratorService.getSubadministrators().on('value', snap => {
      snap.forEach(snap => {
        let subadministratorObj = snap.val();
        subadministratorObj.uid = snap.key;
        this.subadministratorList.push(subadministratorObj);
        return false;
      });
    })
  }

  openModalDepartments(modalName) {
    this.alertModal = false;
    this.textAlertModal = "";
    this.action = "create";
    this.code = this.nameDepartment = "";
    this.subadministrator = "0";
    this.btnAction = "Crear Unidad";
    this.getSubadministrators();
    this.modalRef = this.modalService.show(modalName);
  }

  openModalWithParams(modalName, uid) {
    this.administratorService.getDepartmentByUid(uid).on('value', snap => {
      this.action = "edit";
      this.alertModal = false;
      this.btnAction = "Editar Unidad";
      this.uid = snap.key;
      this.code = snap.val().code;
      this.nameDepartment = snap.val().nameDepartment;
      this.administratorService.getSubadministratorByUid(snap.val().subadministrator).on('value', snap => {
        if (snap.val() == null) {
          this.subadministrator = "0";
        } else {
          this.subadministrator = snap.key;
        }
      });
      this.modalRef = this.modalService.show(modalName);
    })
    error => {
      console.log(error);
    }
  }


  createDepartment(code, nameDepartment, subadministrator) {
    if (this.action == "create") {
      this.administratorService.createDepartment(code, nameDepartment, subadministrator).then(result => {
        this.modalRef.hide();
      })
    } else {
      this.administratorService.updateDepartment(code, nameDepartment, subadministrator, this.uid).then(result => {
        this.modalRef.hide();
      })
    }
  }


  removeDepartment(uid) {
    var result = confirm("Seguro desea eliminar la unidad?");
    if (result) {
      this.administratorService.deleteDepartment(uid)
        .then(res => {
          this.alert = "success";
          this.textAlert = "Unidad Eliminada Correctamente";
        })
        .catch(error => {
          this.alert = "error";
          this.textAlert = error.message;
        });
    }
    else {
      console.log("Cancelar");
    }
  }

}
