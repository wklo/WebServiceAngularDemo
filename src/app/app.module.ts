import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

// Application specific modules
//
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { Globals } from './globals';
import { AlertComponent, LoggedInUserComponent, LoginComponent, 
         HomeComponent, SearchStudentsComponent, StudentProfileComponent } from './components/index';
import { AlertService, AuthenticationService, DestinyOneService, StudentService } from './services/index';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    LoggedInUserComponent,
    LoginComponent,
    HomeComponent,
    SearchStudentsComponent,
    StudentProfileComponent
  ],
  providers: [
    AlertService,
    AuthenticationService, 
    DestinyOneService,
    Globals,
    StudentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
