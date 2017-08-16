import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import "rxjs/add/operator/map";
import { tokenNotExpired } from 'angular2-jwt';
@Injectable()
export class AuthService {
	public headers = new HttpHeaders().set("Content-Type","application/json");

  constructor(private http:HttpClient) { }

  setToken(){
  	let token = localStorage.getItem('token');
  
  	this.headers = new HttpHeaders().set("Authorization",token);
  }

  loggedIn() {
  return tokenNotExpired();
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
 verifyToken(token){
   console.log(token);
  return this.http.put("http://localhost:3000/activate/"+token,{headers:this.headers}).map(res=>{
      return res;
    });
  }

  resendToken(email){
    return this.http.put("http://localhost:3000/resend",email,{headers:this.headers}).map(res=>{
      return res;
    });
  }


}
