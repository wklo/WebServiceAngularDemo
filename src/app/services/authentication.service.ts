import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { User } from '../models/index';
import { Globals } from '../globals';
import { DestinyOneService } from "./destiny-one.service";



@Injectable()
export class AuthenticationService {

    constructor(
        private desitnyOneService: DestinyOneService,
        private myGlobals: Globals) { }

    login(username: string, password: string) {
        return this.desitnyOneService
            .login(username, password)
            .map((response: Response) => {
                let userSessionId = response.text();
				console.log(userSessionId);
                this.myGlobals.loggedInUserSessionId = userSessionId;
				let currentUser = new User();
				currentUser.username = username;
                this.myGlobals.loggedInUser = currentUser;
				console.log(localStorage)
            })
            .catch(this.handleError);
    }


    logout() {
        this.myGlobals.loggedInUserSessionId = null;
        this.myGlobals.loggedInUser = null;
    }        


	private handleError (error: Response | any) {
		return Observable.throw(error.text());
	}
}