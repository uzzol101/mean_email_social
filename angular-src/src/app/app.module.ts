import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

// ===================  routing module =======================
import {AppRoutingModule} from "./app-routing.module";
import { FlashMessagesModule } from 'angular2-flash-messages';
// import { Angular2SocialLoginModule } from "angular2-social-login";
// ================ services ================
import {AuthService} from "./services/auth.service";
import {SharedService} from "./services/shared.service";
import {ValidatorService} from "./services/validator.service";
import { ProfileComponent } from './components/profile/profile.component';


let providers = {
    "facebook": {
      "clientId": "726688227533356",
      "apiVersion": "v2.5" //like v2.4 
    }
  };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // Angular2SocialLoginModule,
    HttpClientModule,
    FlashMessagesModule,
    AppRoutingModule
  ],
  providers: [AuthService,ValidatorService,SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }

 // Angular2SocialLoginModule.loadProvidersScripts(providers);