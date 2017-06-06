import { Component, OnInit } from '@angular/core';
import { Router } 	from '@angular/router';

import { Student } from '../models/index';
import { Globals } from '../globals';
import { StudentService} from '../services/index';

@Component({
    selector: "search-students",
	templateUrl: 'search-students.component.html'
})

export class SearchStudentsComponent implements OnInit {
	model: any = {};
	students: Student[] = [];
	errorMessage: string = "";
	searchInProgress: boolean = false;
	selectedStudent: Student;

	constructor(
		private studentService: StudentService,
		private router: Router) { }

	ngOnInit() {
		this.selectedStudent = null;
	}


	searchStudent() {
		console.log("Search student: " + this.model.searchCriteria)
		this.students = null;
		this.errorMessage = "";
		this.searchInProgress = true;
		this.studentService.searchStudent('lastName', this.model.searchCriteria)
			.then((data: Student[]) => {
				this.students = data;
				this.searchInProgress = false;
			})
			.catch((error: any) => {
				this.errorMessage = error;
				this.searchInProgress = false;
			});
	}


	selectStudent(student: Student) {
		console.log(student);
		this.studentService
			.getStudent(student.objectId)
			.then((student: Student) => { 
				console.log(student);
				this.selectedStudent = student
				this.gotoStudentProfile();
			});
	}


	gotoStudentProfile() {
		this.studentService.currentStudent = this.selectedStudent;
		this.router.navigate(['/studentProfile']);
	}
}
