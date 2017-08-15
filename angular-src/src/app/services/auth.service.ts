import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import "rxjs/add/operator/map";
@Injectable()
export class AuthService {
	public headers = new HttpHeaders().set("Content-Type","application/json");

  constructor(private http:HttpClient) { }

  setToken(){
  	let token = localStorage.getItem('token');
  
  	this.headers = new HttpHeaders().set("Authorization",token);
  }
  registerUser(newUser){
  	return this.http.post("http://localhost:3000/register",newUser,{headers: this.headers}).map(res=>{
  		return res;
  	});
  }

  loginUser(user){
  	return this.http.post("http://localhost:3000/login",user,{headers:this.headers}).map(res=>{
  		return res;
  	});
  }

  getProfile(){
  	this.setToken();
  	return this.http.get("http://localhost:3000/profile",{headers:this.headers}).map(res=>{
  		return res;
  	});
  }

  fbUser(){
  return this.http.get("http://localhost:3000/auth/facebook",{observe: 'response'}).map(res=>{
      return res;
    });
  }
 // twtUser(){
 //  return this.http.get("http://127.0.0.1:3000/auth/twitter",{observe: 'response'}).map(res=>{
 //      return res;
 //    });
 //  }


}
