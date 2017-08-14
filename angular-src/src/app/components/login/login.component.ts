import { Component, OnInit } from '@angular/core';
import{Router} from "@angular/router";
import {AuthService } from "../../services/auth.service";
import {SharedService } from "../../services/shared.service";
import {ValidatorService } from "../../services/validator.service";
import { FlashMessagesService } from 'angular2-flash-messages';
// import { AuthService as FbService} from "angular2-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	username:String;
	password:String;
  constructor(private authService:AuthService,private validator:ValidatorService,private flash:FlashMessagesService,private router:Router,private sharedService:SharedService) { }

  ngOnInit() {
  }

  onLoginSubmit(){
  	var user = {
  		username:this.username,
  		password:this.password
  	};

  	if(this.validator.validateLogin(user)){
  		this.authService.loginUser(user).subscribe((data:any)=>{
  			if(data.success){
          localStorage.setItem('token',data.user.token);
          localStorage.setItem("user",data.user.username);
          this.sharedService.getFromLogin(data.user.username);
  				this.flash.show(data.msg,{cssClass:"alert-success",timeout:3000});
  				this.router.navigate(["/home"]);
  			}else{
  				this.flash.show(data.msg,{cssClass:"alert-danger",timeout:3000});
  			}
  		});
  	}
  }

 fbLogin(){
   this.authService.fbUser().subscribe(data=>{
     if(data.url){
       // handling fb callback url here.
       // window.open(data.url);
       window.location.href = data.url

     }
     console.log(data);
   });
 }


}
