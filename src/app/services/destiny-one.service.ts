import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Globals } from '../globals';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Student, Certificate, StudentCertificateEnrollment, 
         GetStudentCertificateEnrollmentsRequest, GetStudentCertificateEnrollmentsRequestDetail,
         DropStudentFromCertificateRequest, DropStudentFromCertificateRequestDetail,
         EnrollStudentInCertificateRequest, EnrollStudentInCertificateRequestDetail } from '../models/index';

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


    getCertificates(): Observable<Certificate[]> {
        return this.http.get(
            this.getPublicRESTfulUrl('certificates')
        ).map((response: Response) => {
            console.log(response.json().certificate);
            return response.json().certificate;
        }).catch((error: Response) => {
            console.log(error.toString());
            return Observable.throw(error.toString());
        });
    }



    getStudentCertificateEnrollments(student: Student): Observable<StudentCertificateEnrollment[]> {
        return this.http.post(
            this.getInternalRESTfulUrl('getStudentCertificateEnrollments'),
            this.createGetStudentCertificateEnrollmentsRequestPayload(student.objectId),
            this.createRequestOptions('application/json')
        ).map((response: Response) => {            
            console.log(response);
            return response.json().getStudentCertificateEnrollmentsResult.enrolledCertificates.enrolledCertificate;
        }).catch((error: Response) => {
            console.log(error.toString());
            return Observable.throw(error.toString());
        });
    }

    
    dropStudentFromCertificate(student: Student, certificateCode: string) {
        return this.http.post(
            this.getInternalRESTfulUrl('dropStudentFromCertificate'),
            this.createDropStudentFromCertificateRequestPayload(student.objectId, certificateCode),
            this.createRequestOptions('application/json')
        ).map((response: Response) => {
            console.log(response.json());
            return response.json();
        }).catch((error: Response) => {
            console.log(error.text());
            return Observable.throw(error.text());
        });
    }

    
    enrollStudentInCertificate(student: Student, certificate: Certificate) {
        return this.http.post(
            this.getInternalRESTfulUrl('enrollStudentInCertificate'),
            this.createEnrollStudentInCertificateRequestPayload(student.objectId, certificate.code),
            this.createRequestOptions('application/json')
        ).map((response: Response) => {
            console.log(response.json());
            return response.json();
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


    private createGetStudentCertificateEnrollmentsRequestPayload(studentId: number) {
        let getStudentCertificateEnrollmentsRequestDetail = new GetStudentCertificateEnrollmentsRequestDetail();
        getStudentCertificateEnrollmentsRequestDetail.matchOn = "objectId";
        getStudentCertificateEnrollmentsRequestDetail.attributeValue = studentId.toString();

        let getStudentCertificateEnrollmentsRequest = new GetStudentCertificateEnrollmentsRequest();
        getStudentCertificateEnrollmentsRequest.getStudentCertificateEnrollmentsRequestDetail = getStudentCertificateEnrollmentsRequestDetail;

        let payload = JSON.stringify(getStudentCertificateEnrollmentsRequest);
        console.log('getStudenCertificateEnrollmentsRequest payload: ' + payload);
        return payload;
    }


    private createEnrollStudentInCertificateRequestPayload(studentId: number, certificateCode: string) {
        let enrollStudentInCertificateRequestDetail = new EnrollStudentInCertificateRequestDetail();
        enrollStudentInCertificateRequestDetail.certificateCode = certificateCode;
        enrollStudentInCertificateRequestDetail.matchOn = "objectId";
        enrollStudentInCertificateRequestDetail.attributeValue = studentId.toString();

        let enrollStudentInCertificateRequest = new EnrollStudentInCertificateRequest();
        enrollStudentInCertificateRequest.enrollStudentInCertificateRequestDetail = enrollStudentInCertificateRequestDetail;

        let payload = JSON.stringify(enrollStudentInCertificateRequest);
        console.log('createEnrollStudentInCertificateRequest payload: ' + payload);
        return payload;
    }


    private createDropStudentFromCertificateRequestPayload(studentId: number, certificateCode: string) {
        let dropStudentFromCertificateRequestDetail = new DropStudentFromCertificateRequestDetail();
        dropStudentFromCertificateRequestDetail.certificateCode = certificateCode;
        dropStudentFromCertificateRequestDetail.matchOn = "objectId";
        dropStudentFromCertificateRequestDetail.attributeValue = studentId.toString();

        let dropStudentFromCertificateRequest = new DropStudentFromCertificateRequest();
        dropStudentFromCertificateRequest.dropStudentFromCertificateRequestDetail = dropStudentFromCertificateRequestDetail;

        let payload = JSON.stringify(dropStudentFromCertificateRequest);
        console.log('createDropStudentFromCertificateRequest payload: ' + payload);
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