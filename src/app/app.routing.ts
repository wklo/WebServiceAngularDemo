import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, LoggedInUserComponent, HomeComponent,
         StudentProfileComponent } from './components/index';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'studentProfile', component: StudentProfileComponent },
    { path: '', component: LoginComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);