import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router,ParamMap}from "@angular/router";
import {AuthService} from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {
	token;
  constructor(private authService:AuthService, private route:ActivatedRoute,private router:Router,private flash:FlashMessagesService) { }

  ngOnInit() {

  	this.token = this.route.snapshot.paramMap.get("id");


   this.authService.verifyToken(this.token).subscribe((data:any)=>{
     if(data.success){
       console.log(data);
       this.flash.show(data.msg,{cssClass:"alert-success",timeout:2000});
       this.router.navigate(["/"]);
     }else{
       console.log(data);
       
        this.flash.show(data.msg,{cssClass:"alert-danger",timeout:2000});
       this.router.navigate(["register"]);
     }
    });

  }

}
