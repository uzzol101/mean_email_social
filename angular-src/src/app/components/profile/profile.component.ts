import { Component, OnInit } from '@angular/core';
import {AuthService } from "../../services/auth.service";
import {SharedService } from "../../services/shared.service";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	data:Object;
 
  constructor(private authService:AuthService,private shared:SharedService) { }

  ngOnInit() {
  	this.authService.getProfile().subscribe((data:any)=>{
  		 this.data = data;
       this.shared.getFromLogin(data.user);
       localStorage.setItem('user',data.user.username);


  	});

    
  }



}
