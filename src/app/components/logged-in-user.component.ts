import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/index';
import { Globals } from '../globals';

@Component({
    selector: 'logged-in-user',
    templateUrl: 'logged-in-user.component.html'
})

export class LoggedInUserComponent {
    constructor(private router: Router,
                private myGlobals: Globals) { }

    get loggedInUser(): User {
        return this.myGlobals.loggedInUser;
    }


    logout() {
        this.myGlobals.loggedInUser = null;
        this.myGlobals.loggedInUserSessionId = null;
        this.router.navigate(['/login']);
    }
}