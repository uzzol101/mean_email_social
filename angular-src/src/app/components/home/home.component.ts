import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router,ParamMap}from "@angular/router";
import {AuthService} from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	token;
 
  constructor(private authService:AuthService, private route:ActivatedRoute,private router:Router,private flash:FlashMessagesService) { }

  ngOnInit() {
  	this.token = this.route.snapshot.paramMap.get("id");
  	this.setToken();
    setTimeout(()=>{
      this.router.navigate(["/profile"]);
    },100);

  }

  setToken(){
  	localStorage.setItem("token",this.token);
 
  }

}
