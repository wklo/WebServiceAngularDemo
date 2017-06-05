import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Globals } from '../globals';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class DestinyOneService {
    constructor(
        private http: Http,
        private myGlobals: Globals
    ) { }


    login(username: string, password: string) {
        let extraParameters = new Map<string, any>();
        extraParameters.set('username', username);
        extraParameters.set('password', password);

        return this.http
            .get(this.getInternalRESTfulUrl('login', extraParameters))
            .map((response: Response) => response)
            .catch(this.handleError);
    }


    private getInternalRESTfulUrl(method: string, extraParameters?: Map<string, any>) {
        let currentUserSessionId = localStorage.getItem('currentUserSessionId');
        let restfulUrl = this.myGlobals.destinyOneInternalWebServiceRESTfulUrl + '/' + method + '?_type=json&sessionId=' + currentUserSessionId;
        if (extraParameters != null) {
            extraParameters.forEach((value: any, key: string) => {
                restfulUrl = restfulUrl + '&' + key + "=" + value;
            });
        }

        console.log('Internal RESTful url for method ' + method + ': ' + restfulUrl);

        return restfulUrl;
    }



    private getPublicRESTfulUrl(method: string, extraParameters?: Map<string, any>) {
        let restfulUrl = this.myGlobals.destinyOnePublicWebServiceRESTfulUrl + '/' + method + '?_type=json';
        if (extraParameters != null) {
            extraParameters.forEach((value: any, key: string) => {
                restfulUrl = restfulUrl + '&' + key + "=" + value;
            });
        }

        console.log('Public RESTful url for method ' + method + ': ' + restfulUrl);

        return restfulUrl;
    }


  
    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }
}