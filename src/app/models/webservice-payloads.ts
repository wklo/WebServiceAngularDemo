export class GetStudentCertificateEnrollmentsRequestDetail {
    matchOn: string;
    attributeValue: string;
    includeInProgressEnrolledCertificates: boolean;
    includeCompletedandIssuedEnrolledCertificates: boolean;
}


export class GetStudentCertificateEnrollmentsRequest {
    getStudentCertificateEnrollmentsRequestDetail: GetStudentCertificateEnrollmentsRequestDetail;
}


export class DropStudentFromCertificateRequestDetail {
    matchOn: string;
    attributeValue: string;
    certificateCode: string;
}


export class DropStudentFromCertificateRequest {
    dropStudentFromCertificateRequestDetail: DropStudentFromCertificateRequestDetail;
}



export class EnrollStudentInCertificateRequestDetail {
    matchOn: string;
    attributeValue: string;
    certificateCode: string;
}


export class EnrollStudentInCertificateRequest {
    enrollStudentInCertificateRequestDetail: EnrollStudentInCertificateRequestDetail;
}

