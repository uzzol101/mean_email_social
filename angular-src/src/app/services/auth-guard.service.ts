import { Injectable } from '@angular/core';
import {Router,CanActivate} from "@angular/router";
import {AuthService} from "./auth.service";
import { tokenNotExpired } from 'angular2-jwt';
@Injectable()
export class AuthGuardService implements CanActivate {
 
  constructor(private auth: AuthService, private router: Router) {}
 
  canActivate() {
    if(this.auth.loggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}