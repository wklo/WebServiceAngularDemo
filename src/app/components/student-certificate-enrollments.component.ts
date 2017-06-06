
import { Component, OnInit, Renderer2, ElementRef, Input} from '@angular/core';
import { Location } from '@angular/common';

import { Student, Certificate, StudentCertificateEnrollment } from '../models/index';
import { AlertService, DestinyOneService, StudentService } from '../services/index';


@Component({
    selector: 'student-certificate-enrollments',
	templateUrl: 'student-certificate-enrollments.component.html'
})

export class StudentCertificateEnrollmentsComponent implements OnInit {
    readonly operationAddCertificate = 'addCertificate';
    readonly operationDropCertificate = 'dropCertificate';
    readonly operationRefreshCertificateEnrollments = 'refershCertificateEnrollments';
    readonly operationRefreshCertificates = 'refreshCertificates';
    
	errorMessage: string = "";
    @Input() currentStudent: Student;
    studentCertificateEnrollments: StudentCertificateEnrollment[];
    certificates: Certificate[];
    operationsInProgress: Map<string, boolean> = new Map(); 
    addCertificateResult: any;
    dropCertificateResult: any;
    initialized: boolean = false;

	constructor(
        private studentService: StudentService,
        private destinyOneService: DestinyOneService,
        private alertService: AlertService,
        private location: Location,
        private elementRef: ElementRef,
        private render: Renderer2
    ) {
        this.render.listen(elementRef.nativeElement, 'click',
            (event) => {this.alertService.clearMessage()}
        );
    }


	ngOnInit() {
        this.currentStudent = this.studentService.currentStudent;
        this.studentCertificateEnrollments = null;
        if (this.currentStudent) {
            this.refreshCertificateEnrollments();
            this.refreshCertificates();
        }
        this.initialized = true;
    }


    addCertificate(certificate: Certificate) {
		this.errorMessage = "";
        this.addCertificateResult = null;

        let operationKey = this.operationAddCertificate + certificate.code;
        this.startOperation(operationKey);
        this.destinyOneService.enrollStudentInCertificate(this.currentStudent, certificate)
            .subscribe(
                result => {
                    this.addCertificateResult = result;
                    console.log(result);
                    // Need to refresh the list of certificate enrollments and remove the
                    // certificate just added from the list of certificate availables.
                    //
                    this.refreshCertificateEnrollments();
                    this.certificates.splice(this.certificates.indexOf(certificate), 1);
                    this.endOperation(operationKey);
                },
                (error: any) => {
                    console.log(error);
                    this.errorMessage = error;
                    this.alertService.error(error);
                    this.endOperation(operationKey);
                }
            );
	}


    dropCertificate(certificateCode: string) {
		this.errorMessage = "";
        this.dropCertificateResult = null;

        let operationKey = this.operationDropCertificate + certificateCode;
        this.startOperation(operationKey);
		this.destinyOneService.dropStudentFromCertificate(this.currentStudent, certificateCode)
            .subscribe(
                result => {
                    this.dropCertificateResult = result;
                    console.log(result);
                    let certificateDropped: any;
                    // Need to remove the certificate dropped from the current list of certificate enrollments
                    // and add it back to the list of available certificates. This implementation is not
                    // necessary correct in that the dropped certificate may no longer available for registration.
                    //
                    this.studentCertificateEnrollments =
                        this.studentCertificateEnrollments.filter(element => {                                
                                if (element.code == result.dropStudentFromCertificateResult.certificateCode) {
                                    certificateDropped = element;
                                    return false;
                                }
                                else {
                                    return true;
                                }
                        });                        
                    this.endOperation(operationKey);

                    console.log(certificateDropped);
                    this.certificates.push(certificateDropped);
                    this.certificates.sort(this.orderByCode);
                    console.log(this.certificates);
                },
                (error: any) => {
                    console.log(error);
                    this.errorMessage = error;
                    this.alertService.error(error);
                    this.endOperation(operationKey);
                }
            );
	}


	goBack() {
        this.location.back();
    }


    refreshCertificateEnrollments() {
        this.startOperation(this.operationRefreshCertificateEnrollments);
        this.destinyOneService.getStudentCertificateEnrollments(this.currentStudent)
            .subscribe(
                certificateEnrollments => {
                    console.log("Student certificate enrollments: " + certificateEnrollments);
                    if (certificateEnrollments) {
                        // If the student has only a single ceritificate enrollment, the API
                        // currently returns that certificate enrollment directly in the payload, 
                        // rather than an array of a single element.
                        //
                        if (Array.isArray(certificateEnrollments)) {
                            this.studentCertificateEnrollments = certificateEnrollments;
                            this.studentCertificateEnrollments.sort(this.orderByCode);
                        }
                        else {
                            this.studentCertificateEnrollments = new Array();
                            this.studentCertificateEnrollments.push(certificateEnrollments);
                        }
                    }
                    this.endOperation(this.operationRefreshCertificateEnrollments);
                }
            );
    }

    
    refreshCertificates(serverSideRefresh: boolean = true) {
        this.startOperation(this.operationRefreshCertificates);
        if (serverSideRefresh) {
            this.destinyOneService.getCertificates()
                .subscribe(
                    certificates => {
                        console.log("School certificates: " + certificates);
                        this.certificates = certificates;
                        if (this.studentCertificateEnrollments) {
                            this.certificates = this.certificates.filter(certificate => { 
                                let alreadyEnrolled =
                                    this.studentCertificateEnrollments.some(certificateEnrollment => {
                                        return certificateEnrollment.code == certificate.code;
                                    });
                                return !alreadyEnrolled;
                            });
                        }

                        this.certificates.sort(this.orderByCode);
                        this.endOperation(this.operationRefreshCertificates);
                    }
            );
        }
        else {
            if (this.studentCertificateEnrollments && this.certificates) {
                this.certificates = this.certificates.filter(certificate => { 
                    let alreadyEnrolled =
                        this.studentCertificateEnrollments.some(certificateEnrollment => {
                            return certificateEnrollment.code == certificate.code;
                        });
                    return !alreadyEnrolled;
                });
            }
            this.endOperation(this.operationRefreshCertificates);
        }
    }



    isOperationInProgress(op: string): boolean {
        return this.operationsInProgress.get(op);
    }


    private startOperation(operation: string) {
        this.operationsInProgress.set(operation, true);
    }

    private endOperation(operation: string) {
        this.operationsInProgress.delete(operation);
    }
        
    private orderByCode(a: any, b: any): number {
        if (a.code < b.code) return -1
        else if (a.code > b.code) return 1
        else return 0;
    }

}
