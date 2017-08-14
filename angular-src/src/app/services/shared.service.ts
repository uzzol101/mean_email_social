import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
@Injectable()
export class SharedService {
	userFromLogin = new Subject();
  constructor() { }

  getFromLogin(user){
  	return this.userFromLogin.next(user);
  }

}
