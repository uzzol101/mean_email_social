import {NgModule} from '@angular/core';
import {Routes,RouterModule} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ActivateComponent } from './components/activate/activate.component';
import { ResendComponent } from './components/resend/resend.component';

import { AuthGuardService } from './services/auth-guard.service';
export const routes:Routes = [

	{
		path:'register',
		component:RegisterComponent
	},
	{
		path:"login",
		component:LoginComponent
	},
{
		path:"resend",
		component:ResendComponent
	},

	{
		path:"home/:id",
		component:HomeComponent
	},{
		path:"activate/:id",
		component:ActivateComponent
	},
		{
		path:'',
		component:WelcomeComponent
	},
	{
		path:'profile',
		canActivate:[AuthGuardService],
		component:ProfileComponent
	}
];

@NgModule({
	imports:[RouterModule.forRoot(routes)],
	exports:[RouterModule]
})

export class AppRoutingModule {

}