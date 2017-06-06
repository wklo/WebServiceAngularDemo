import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Globals } from '../globals';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Student } from '../models/index';


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



    searchStudent(parameter: string, value: string): Observable<Student[]> {
        return this.http.post(
            this.getInternalRESTfulUrl('searchStudent'),
            this.createSearchStudentRequestPayload(parameter, value),
            this.createRequestOptions('application/xml')
        ).map((response: Response) => {
            console.log(response.json());
            return response.json().student;
        }).catch((error: Response) => {
            console.log(error.text());
            return Observable.throw(error.text());
        });
    }


    getStudent(objectId: number): Observable<Student> {
        return this.http.get(
            this.getInternalRESTfulUrl('student/objectId/' + objectId)
        ).map((response: Response) => {
            console.log(response.json());
            return response.json().getStudentResult.student;
        }).catch((error: Response) => {
            console.log(error.text());
            return Observable.throw(error.text());
        });

    }



    private getInternalRESTfulUrl(method: string, extraParameters?: Map<string, any>) {
        let currentUserSessionId = this.myGlobals.loggedInUserSessionId;
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

    private createSearchStudentRequestPayload(parameter: string, value: string) {
        let payload = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><studentSearchCriteria><' + parameter + '>' + value + '</' + parameter + '></studentSearchCriteria>';
        console.log('SearchStudentRequest payload for parameter ' + parameter + ' with value ' + value + ': ' + payload);

        return payload;
    }

    private createRequestOptions(contentType: string) {
        let headers = new Headers({ 'Content-Type': contentType, 'Accept': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return options;
    }


  
    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }
}