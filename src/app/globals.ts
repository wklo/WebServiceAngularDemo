import { Injectable } from '@angular/core';
import { User } from './models/index';

@Injectable()
export class Globals {
    readonly destinyOneInternalWebServiceRESTfulUrl='https://demoqaws.destiny.local/webservice/InternalViewREST';
    readonly destinyOnePublicWebServiceRESTfulUrl='https://demoqaws.destiny.local/webservice/PublicViewREST';

    loggedInUser: User;
    loggedInUserSessionId: string;
}
