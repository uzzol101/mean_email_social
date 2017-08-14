import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router,ParamMap}from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	token;
  constructor(private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
  	this.token = this.route.snapshot.paramMap.get("id");
  	this.setToken();

  }

  setToken(){
  	localStorage.setItem("token",this.token);
  }

}
