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
         HomeComponent } from './components/index';
import { AlertService, AuthenticationService, DestinyOneService } from './services/index';

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
    HomeComponent
  ],
  providers: [
    AlertService,
    AuthenticationService, 
    DestinyOneService,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
