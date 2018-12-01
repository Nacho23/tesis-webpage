import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  constructor() { }

  // --------------- DEPARTMENT ------------------
  getDepartments() {
    return firebase.database().ref('/department/');
  }

  getDepartmentByUid(uid: string) {
    return firebase.database().ref('/department/' + uid);
  }

  createDepartment(code: string, nameDepartment: string, subadministrator: string) {
    let obj = {
      code: code,
      nameDepartment: nameDepartment,
      subadministrator: subadministrator
    }
    return firebase.database().ref('/department/').push(obj);
  }

  updateDepartment(code: string, nameDepartment: string, subadministrator: string, uid:string) {
    let obj = {
      code: code,
      nameDepartment: nameDepartment,
      subadministrator: subadministrator
    }
    return firebase.database().ref('/department/' + uid + '/').update(obj);
  }

  deleteDepartment(uid: string) {
    return firebase.database().ref('/department/' + uid).remove();
  }

  // --------------- SUBADMINISTRATOR ------------------
  getSubadministrators() {
    return firebase.database().ref('/userProfile/').orderByChild('type').equalTo('subadministrator');
  }

  getSubadministratorByUid(uid: string) {
    return firebase.database().ref('/userProfile/' + uid); 
  }

  createUser(firstName: string, lastName: string, rut: string, email: string, pass:string) {
    let createUser = firebase.functions().httpsCallable('createUser'); 
    createUser({email: email, pass: pass}).then(result => { 
      console.log(result);
      return firebase.database().ref('/userProfile/' + result.data.uid)
      .set(
        {
          rut: rut,
          firstName: firstName,
          lastName: lastName,
          email: result.data.email, 
          type: "subadministrator"
        }
      );      
    })
  }

  updateUser(firstName: string, lastName: string, rut: string, email: string, uid:string) {
    let obj = {
      firstName: firstName,
      lastName: lastName,
      rut: rut,
      email: email
    }
    return firebase.database().ref('userProfile/' + uid + '/').update(obj);
  }


  // --------------- CATEGORY ------------------
  getCategory() {
    return firebase.database().ref('/category/').orderByChild('category');
  }

  getCategoryByUid(uid: string) {
    return firebase.database().ref('/category/' + uid); 
  }

  createCategory(category: string, departmentUid: string) {
    return firebase.database().ref('/category/').push({category: category, departmentUid: departmentUid});
  }

  deleteCategory(uid: string) {
    return firebase.database().ref('/category/' + uid).remove();
  }

}
