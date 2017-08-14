import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ValidatorService} from "../../services/validator.service";
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	username:String;
	email:String;
	password:String;
  constructor(private authService:AuthService,private validator:ValidatorService,private falsh:FlashMessagesService) { }

  ngOnInit() {
  }

  onSubmit(){
  	let newUser = {
  		username:this.username,
  		email:this.email,
  		password:this.password
  	};

  	if(this.validator.validateRegistration(newUser)){
  		this.authService.registerUser(newUser).subscribe((data:any)=>{
  			this.falsh.show(data.msg,{cssClass:"alert-success",timeout:2000});
  		});
  	}
  }

}
