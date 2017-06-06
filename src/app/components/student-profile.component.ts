import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } 	from '@angular/router';


import { Student } from '../models/index';
import { Globals } from '../globals';
import { StudentService} from '../services/index';

@Component({
    selector: "student-profile",
	templateUrl: 'student-profile.component.html',
    styleUrls: ['./student-profile.component.css']    
})

export class StudentProfileComponent implements OnInit {
	currentStudent: Student;

	constructor(
		private studentService: StudentService,
		private router: Router,
        private location: Location) { }

	ngOnInit() {
		this.currentStudent = this.studentService.currentStudent;
	}


	goBack() {
        this.location.back();
    }

}
