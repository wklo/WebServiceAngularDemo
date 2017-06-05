import { Component } from '@angular/core';

import { User } from '../models/index';
import { Globals } from '../globals';

@Component({
    templateUrl: 'home.component.html'
})

export class HomeComponent {

    constructor(private myGlobals: Globals) {} 

    get loggedInUser(): User {
        return this.myGlobals.loggedInUser;
    }
}