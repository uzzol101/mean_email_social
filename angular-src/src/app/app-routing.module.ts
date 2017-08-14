import {NgModule} from '@angular/core';
import {Routes,RouterModule} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
export const routes:Routes = [

	{
		path:'register',
		component:RegisterComponent
	},
	{
		path:"login",
		component:LoginComponent
	},{
		path:"home/:id",
		component:HomeComponent
	},
		{
		path:'',
		component:HomeComponent
	},
	{
		path:'profile',
		component:ProfileComponent
	}
];

@NgModule({
	imports:[RouterModule.forRoot(routes)],
	exports:[RouterModule]
})

export class AppRoutingModule {

}