import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { user } from '../../../environments/environment';

@Component({
    templateUrl: 'history.component.html'
})
export class HistoryComponent {
    public usersList: Array<any>;

    public type: string = "padrino";
    public year: string = "2018";

    constructor(private router: Router, private userService: UserService) {
        this.loadTable(this.year, this.type);
    }

    loadTable(year, type) {
        this.usersList = [];
        this.userService.getUsersList(user.departmentUid.toString()).once('value', snapList => {
            snapList.forEach(snap => {            
                if (snap.val().year == year && snap.val().type == type) {
                    let usersObj = snap.val();
                    usersObj.uid = snap.key;
                    this.usersList.push(usersObj);
                    return false;
                }
            });
        });
    }

    setYear(year) {
        this.year = year;
        this.loadTable(this.year, this.type);
    }

    setType(type) {
        this.type = type;
        this.loadTable(this.year, this.type);
    }

    openDetailsUser(uid) {
        console.log(uid);
        this.router.navigate(['/base/details-user/', uid]);
    }

}
