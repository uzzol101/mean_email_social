import { Component, OnInit } from '@angular/core';
import {AuthService } from "../../services/auth.service";
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.css']
})
export class ResendComponent implements OnInit {

  constructor(private authService:AuthService,private flash:FlashMessagesService) { }

  ngOnInit() {
  }

  resend(email){
  	var Email = {
  		email:email
  	}

  	this.authService.resendToken(Email).subscribe((data:any)=>{
  	  if(data.success){
        this.flash.show(data.msg,{cssClass:"alert-success",timeout:2000});
      }
      else{
        this.flash.show(data.msg,{cssClass:"alert-info",timeout:2000});
      }
  	});
  }

}
