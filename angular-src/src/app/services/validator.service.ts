import { Injectable } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
@Injectable()
export class ValidatorService {

  constructor(private flash:FlashMessagesService) { }

  validateRegistration(user){
  	if(!user.username || !user.email || !user.password){
  		this.flash.show("Please fill out all form field first",{cssClass:"alert-danger",timeout:3000})
  		return false;
  	}else{
  		
  		return true;
  	}
  }

  validateLogin(user){
    if(!user.username || !user.password){
      this.flash.show("Please fill out all fileds",{cssClass:"alert-danger",timeout:3000});
      return false;
    }else{
      return true;
    }
  }

}
