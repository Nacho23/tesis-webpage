import { Component } from '@angular/core';
import { AdministratorService } from '../../services/administrator/administrator.service';
import { user } from '../../../environments/environment';

@Component({
  templateUrl: 'category.component.html'
})
export class CategoryComponent {

  public categoryList: Array<any> = [];

  public category: string;

  constructor(private administratorService: AdministratorService) {
    this.administratorService.getCategory().on('child_added', snap => {
      let categoryObj = snap.val();
      categoryObj.uid = snap.key;
      this.categoryList.push(categoryObj);
    })
  }

  createCategory(category) {
    this.administratorService.createCategory(category, user.departmentUid);
    this.category = "";
  }

  deleteCategory(uid) {
    this.administratorService.deleteCategory(uid);
    for (let i = 0; i < this.categoryList.length; i++) {
      if (this.categoryList[i].uid == uid) {
        this.categoryList.splice(i, 1);
      }
    }
  }

}
