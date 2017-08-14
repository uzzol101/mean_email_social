import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SharedService } from "../../services/shared.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	user:String;
  constructor(private router:Router,private sharedService:SharedService) { }

  ngOnInit() {
  	// user coming through component communication technique
  	this.sharedService.userFromLogin.subscribe((data:any)=>{
  		this.user =data;
  	});
  	// user coming from localStorage
  	this.user = localStorage.getItem("user");
  }

  logout(){
  	this.user = null;
  	localStorage.clear();
  	this.router.navigate(["/login"]);
  }

  	
  


}
