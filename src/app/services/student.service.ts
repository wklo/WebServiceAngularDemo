import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DestinyOneService } from './destiny-one.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Student } from '../models/index';
import * as myGlobals from '../globals';


@Injectable()
export class StudentService {

	currentStudent: Student;

	constructor(private http: Http,
		private destinyOneService: DestinyOneService) { }



	searchStudent(parameter: string, value: string): Promise<Student[]> {
		return this.destinyOneService.searchStudent(parameter, value)
			.toPromise()
			.then(response => response)
			.catch(this.handleError);
	}


	getStudent(objectId: number): Promise<Student> {
		return this.destinyOneService.getStudent(objectId)
			.toPromise()
			.then(response => response)
			.catch(this.handleError);
	}


	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}
}
